;; -*- coding: utf-8 -*-
;; hiroshi.kimura.0331@gmail.com, 2015-01-07.

(ql:quickload :cl-who)
(ql:quickload :cl-json)
(ql:quickload :hunchentoot)
(ql:quickload :hunchensocket)

(defpackage :js-ws-cl
  (:use :cl :cl-who :cl-json :hunchentoot :hunchensocket))

(in-package :js-ws-cl)

(defvar *acceptor* nil)

(defun start-server (port)
  (setf *acceptor*
        (start (make-instance 'easy-acceptor
                              :port port
                              ;;:document-root #P"/Users/hkim/bt/static/"
                              ))))

(defun publish-static-content ()
  (push (create-static-file-dispatcher-and-handler
         "/js-ws-cl.css" "static/js-ws-cl.css") *dispatch-table*)
  (push (create-static-file-dispatcher-and-handler
         "/js-ws-cl.js" "static/js-ws-cl.js") *dispatch-table*))

(publish-static-content)

(setf (html-mode) :html5)

(defmacro standard-page ((&key title) &body body)
  `(with-html-output-to-string
       (*standard-output* nil :prologue t :indent t)
     (:html :lang "en"
            (:head
             (:meta :charset "utf-8")
             (:title ,title)
             (:link :type "text/css" :rel "stylesheet"
                    :href "/js-ws-cl.css")
             (:script :type "text/javascript" :src "/js-ws-cl.js"))
            (:body ,@body))))

(define-easy-handler (js-ws-cl :uri "/js-ws-cl") ()
  (standard-page (:title "js-ws-cl")
    (:h1 "Websocket Example")
    (:div
     (:p "STAT:" (:span :id "stat")))
    (:div
     (:p "ERROR:" (:span :id "error")))
    (:div
     (:p "JSON.stringify(\""
         (:input :id :js :type "text" :size 40)
         "\" )"
         (:button :id "send" :onClick "toCL()" "send")))
    (:div
     (:p "CL returns:"
         (:span :id "cl" " ")
         ))
    (:hr)
    (:p "programmed by hkimura.")
    ))

;;;
;;; websocket from huncheksocket/demo.lisp
;;;

(defclass resource (hunchensocket:websocket-resource)
  ((name :initarg :name
         :reader name
         :initform (error "Name this action!")))
  (:default-initargs :client-class 'client))

(defclass client (hunchensocket:websocket-client)
  ((name :initarg :user-agent
         :reader name
         :initform (error "Name this user!"))))

(defvar *resources* (list (make-instance 'resource :name "/js-ws-cl")))

(defun find-resource (request)
  (find (hunchentoot:script-name request)
        *resources*
        :test #'string= :key #'name))

(pushnew 'find-resource hunchensocket:*websocket-dispatch-table*)

(defun unicast (route message &rest args)
  (hunchensocket:send-text-message
   (first (hunchensocket:clients route))
   (apply #'format nil message args)))

;;necessary?
(defmethod hunchensocket:client-connected ((route resource) client)
  (unicast route "~a has joined ~a" (name client) (name route)))

(defmethod hunchensocket:client-disconnected ((route resource) client)
  (unicast route "~a has left ~a" (name client) (name route)))

(defun value (x) (rest x))

(defun parse (json-string)
  (let ((alist (json:decode-json-from-string json-string)))
    (encode-json-alist-to-string
     `((:x ,(assoc :x alist))
       (:y ,(assoc :y alist))))
    ))

(defmethod hunchensocket:text-message-received ((route resource) client message)
  (unicast route "~a" (parse message) client))

(defvar *websocket-acceptor* nil)

(defun start-websocket (port)
  (setf *websocket-acceptor*
        (start (make-instance 'hunchensocket:websocket-acceptor
                              :port port))))

(defun stop-servers ()
  (stop *websocket-acceptor*)
  (stop *acceptor*))

;;;
(start-server 8000)
(start-websocket 8001)

