;; -*- coding: utf-8 -*-
;; hiroshi.kimura.0331@gmail.com, 2015-01-07.
;;
;; modified 2015-04-23, document-root
;; 2015-04-24. change ports 20140 and 20141.

(ql:quickload :cl-who)
(ql:quickload :cl-json)
(ql:quickload :hunchentoot)
(ql:quickload :hunchensocket)

(defpackage :shogi-ai
  (:use :cl :cl-who :cl-json :hunchentoot :hunchensocket))

(in-package :shogi-ai)

(load "conector.lisp")

(defvar *acceptor* nil)

(defun start-server (port)
  (setf *acceptor*
        (start (make-instance
                'easy-acceptor
                :port port
                :document-root *default-pathname-defaults*))))

(defun publish-static-content ()
    (push (create-static-file-dispatcher-and-handler
           "/index.html" "index.html") *dispatch-table*)
    (push (create-static-file-dispatcher-and-handler
           "/shogi-ai.css" "static/shogi-ai.css") *dispatch-table*)
    (push (create-static-file-dispatcher-and-handler
         "/shogi-ai.js" "static/shogi-ai.js") *dispatch-table*))

(publish-static-content)

(setf (html-mode) :html5)

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

(defvar *resources* (list (make-instance 'resource :name "/shogi-ai")))

(defun find-resource (request)
  (find (hunchentoot:script-name request)
        *resources*
        :test #'string= :key #'name))

(pushnew 'find-resource hunchensocket:*websocket-dispatch-table*)

(defun unicast (route message &rest args)
  (hunchensocket:send-text-message
   (first (hunchensocket:clients route))
   (apply #'format nil message args)))

;;FIXME.
;;necessary.
(defmethod hunchensocket:client-connected ((route resource) client)
  (initialize)
  (unicast route "~a has joined ~a" (name client) (name route))
  )

(defmethod hunchensocket:client-disconnected ((route resource) client)
  (unicast route "~a has left ~a" (name client) (name route)))

(let ((c 0))
  (defun c-up () (incf c))
  (defun c-reset () (setq c 0)))

(defun value (x) (cdr x))

(defun parse (json-string)
  (let* ((data (json:decode-json-from-string json-string))
         (type (value (assoc :type data)))
         (from (value (assoc :from data)))
         (to   (value (assoc :to   data)))
         (name (value (assoc :name data)))
         (prom (value (assoc :prom data))))
    (encode-json-alist-to-string
     (cond
       ((equal type "init")
        (if (= from 1)
            `((:answer  . ,(updata (cpu))) (:counter . ,(c-up)))
            `((:answer . "intialized"))))
       (t (updata (man (convert from) (convert to) prom name))
          `((:answer  . ,(updata (cpu))) (:counter . ,(c-up))))))))

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
(defun main (&optional (w 20140) (s 20141))
  (start-server w)
  (start-websocket s)
  ;; 起動を維持するために無限ループする
  (loop (sleep 60)))

(sb-ext:save-lisp-and-die "shogi-ai" :executable t :toplevel 'main)

