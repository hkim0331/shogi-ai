;; FIXME
;; slime の C-c C-c で評価するとエラー
;;(ql:quickload '(cl-who hunchentoot hunchensocket cl-json))

(defpackage :downup
   (:use :cl :cl-who :hunchentoot :hunchensocket :cl-json))

(in-package :downup)

;;(ql:quickload '(cl-who hunchentoot hunchensocket cl-json))

(defvar *acceptor* nil)

(defun start-server (port)
  (setf *acceptor*
        (start (make-instance 'easy-acceptor :port port))))

(start-server 8080)

(defun publish-static-content ()
    (push (create-static-file-dispatcher-and-handler
         "/style.css" "downup.css") *dispatch-table*)
    (push (create-static-file-dispatcher-and-handler
         "/downup.js" "downup.js") *dispatch-table*))

(publish-static-content)

(setf (html-mode) :html5)

(defmacro standard-page ((&key title) &body body)
  `(with-html-output-to-string
       (*standard-output* nil :prologue t :indent t)
     (:html :lang "en"
            (:head
             (:meta :charset "utf-8")
             (:title ,title)
             (:link :type "text/css"
                    :rel  "stylesheet"
                    :href "/style.css")
             (:script :type "text/javascript"
                      :src  "/downup.js"))
            (:body
             ,@body))))

(hunchentoot:define-easy-handler (downup :uri "/downup") ()
  (standard-page (:title "downup")
    (:h1"DownUP")
    (:p "please mouse down and up at your favourite place.")
    (:div :id "output")
    (:div :id "sent")
    (:div :id "received")
    (:hr)
    (:p "programmed by hkimura.")))

;;;
;;; websocket from huncheksocket/demo.lisp
;;;

(defclass action (hunchensocket:websocket-resource)
  ((name :initarg :name :reader name
         :initform (error "Name this action!") ))
  (:default-initargs :client-class 'user))

(defclass user (hunchensocket:websocket-client)
  ((name :initarg :user-agent :reader name
         :initform (error "Name this user!"))))

;; Define a list of rooms. Notice that
;; `hunchensocket:*websocket-dispatch-table*` works just like
;; `hunchentoot:*dispatch-table*`, but for websocket specific resources.

(defvar *actions* (list (make-instance 'action :name "/downup")))

(defun find-action (request)
  (find (hunchentoot:script-name request)
        *actions* :test #'string= :key #'name))

(pushnew 'find-action hunchensocket:*websocket-dispatch-table*)

;; OK, now a helper function and the dynamics of a chat room.
(defun broadcast (route message &rest args)
  (loop for peer in (hunchensocket:clients route)
     do (hunchensocket:send-text-message
         peer
         (apply #'format nil message args))))

;; JSON string inside (first args)
(defun unicast (route message &rest args)
  (hunchensocket:send-text-message
   (first (hunchensocket:clients route))
   (apply #'format nil message args)))

(defmethod hunchensocket:client-connected ((route action) user)
  (broadcast route "~a has joined ~a" (name user) (name route)))

(defmethod hunchensocket:client-disconnected ((route action) user)
  (broadcast route "~a has left ~a" (name user) (name route)))

;; text-message-received には三つのパラメータが渡される？
;; (defmethod hunchensocket:text-message-received
;;     ((room chat-room) user message)
;;   (broadcast room "~a says ~a" (name user) message))

(defmethod hunchensocket:text-message-received ((route action) user message)
  (unicast route "LISP: ~a" (parse message) user))

(defun parse (json-string)
  (json:decode-json-from-string json-string))

;; Finally, start the server. `hunchensocket:websocket-acceptor` works
;; just like `hunchentoot:acceptor`, and you can probably also use
;; `hunchensocket:websocket-ssl-acceptor`.

(defvar *websocket-acceptor* nil)

(defun start-websocket (port)
  (setf *websocket-acceptor*
        (start (make-instance 'hunchensocket:websocket-acceptor
                              :port port))))

(start-websocket 8081)
