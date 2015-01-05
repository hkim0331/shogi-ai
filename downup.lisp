;; -*- coding: utf-8 -*-
;;
;; FIXME: slime の C-c C-k で評価するとエラー
;;(ql:quickload '(cl-who hunchentoot hunchensocket cl-json))

;; バラして書いてみる。
(ql:quickload :cl-who)
(ql:quickload :cl-json)
(ql:quickload :hunchentoot)
(ql:quickload :hunchensocket)

(defpackage :downup
     (:use :cl :cl-who :cl-json :hunchentoot :hunchensocket))

(in-package :downup)

(defvar *acceptor* nil)

;; OK define document-root here, but anywhere else?
;; if define document-root, can not find css nor js file.
(defun start-server (port)
  (setf *acceptor*
        (start (make-instance 'easy-acceptor
                              :port port
                              ;; hello.html も見えない。
                              ;;:document-root #P"/Users/hkim/bt/static/"
                              ))))

;; create-static-file-dispatcher-and-hander uri path
(defun publish-static-content ()
  (push (create-static-file-dispatcher-and-handler
         "/downup.css" "static/downup.css") *dispatch-table*)
  (push (create-static-file-dispatcher-and-handler
         "/downup.js" "static/downup.js") *dispatch-table*))

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
                    :href "/downup.css")
             (:script :type "text/javascript"
                      :src  "/downup.js"))
            (:body
             ,@body))))

(define-easy-handler (downup :uri "/downup") ()
  (standard-page (:title "downup")
    (:h1 "DownUP")
         (:p "JavaScript でブラウザ上のドラッグを拾い、CommonLisp に WebSocket通信。")
     (:p "イベントの座標は JavaScript 側では JSON.stringifyし、")
     (:p "CommonLisp はそれを json:decode-json-from-string する。")
     (:table
            (:tr (:th "status") (:td :id "output"))
            (:tr (:th "js to cl") (:td :id "sent"))
            (:tr (:th "cl to js") (:td :id "received")))
     (:h2 "link test")
     (:ul
      (:li (:a :href "hello.html" "static page"))
      (:li "link to " (:a :href "/page1" "another lisp hosted page"))
      (:li "parameters by get? " (:a :href "/page2?x=1&y=2" "with get parameter"))
      (:li "form test"
           (:form :action "/page3" :method "post"
                  (:p "x:" (:input :name "x"))
                  (:p "y:" (:input :name "y"))
                  (:p "z:" (:input :name "z"))
                  (:p (:input :type "submit"))))
      (:li "ws action"
           (:br)
           (:input :id "x")
           "+"
           (:input :id "y")
           (:input :id "op"
                   :type :submit
                   :value "="
                   )
           (:input :id "z"))
      )
     (:hr)
    (:p "programmed by hkimura.")))

(define-easy-handler (page1 :uri "/page1") ()
  (standard-page (:title "another page")
    (:h1 "another page")
    (:p "no params.")
    (:p "back to " (:a :href "/downup" "downup"))
    (:hr)
    (:p "programmed by hkimura.")))

(define-easy-handler (page2 :uri "/page2") (x y)
  (standard-page (:title "parameters?")
    (:h1 "Parameters passed by GET")
    (:p "see the uri above.")
    (:p (fmt "x:~d, y:~d" x y))
    (:p "back to " (:a :href "/downup" "downup"))
    (:hr)
    (:p "programmed by hkimura.")))

(define-easy-handler (page3 :uri "/page3") (x y z)
  (standard-page (:title "parameters?")
    (:h1 "Parameters passed by POST")
    (:p (fmt "x:~d, y:~d, z:~d" x y z))
    (:p "back to " (:a :href "/downup" "downup"))
    (:hr)
    (:p "programmed by hkimura.")))
;;;
;;; websocket from huncheksocket/demo.lisp
;;;

(defclass action (hunchensocket:websocket-resource)
  ((name :initarg :name :reader name
         :initform (error "Name this action!")))
  (:default-initargs :client-class 'user))

(defclass user (hunchensocket:websocket-client)
  ((name :initarg :user-agent :reader name
         :initform (error "Name this user!"))))

;; Define a list of rooms. Notice that
;; `hunchensocket:*websocket-dispatch-table*` works just like
;; `hunchentoot:*dispatch-table*`, but for websocket specific resources.

;; FIXME: calc を追加するとしたらここ。追加してどう呼ぶか？
(defvar *actions* (list (make-instance 'action :name "/downup")))

(defun find-action (request)
  (find (hunchentoot:script-name request)
        *actions*
        :test #'string= :key #'name))

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
  (unicast route "~a" (parse message) user))

;; FIXME: ここで将棋AIのプログラムををはさめばいい。
(defun value (x) (rest x))

(defun parse (json-string)
  ;;FIXME: functionize
  (let* ((data (json:decode-json-from-string json-string))
         (type (value (assoc :type data)))
         (arg1 (value (assoc :arg-1 data)))
         (arg2 (value (assoc :arg-2 data))))
    (if (string-equal "mouse" type)
        (if (equal arg1 arg2)
            (format nil "double click at ~a" arg1)
            (format nil "drag from ~a to ~a" arg1 arg2))
        (+ arg1 arg2))))

;; Finally, start the server. `hunchensocket:websocket-acceptor` works
;; just like `hunchentoot:acceptor`, and you can probably also use
;; `hunchensocket:websocket-ssl-acceptor`.

(defvar *websocket-acceptor* nil)

(defun start-websocket (port)
  (setf *websocket-acceptor*
        (start (make-instance 'hunchensocket:websocket-acceptor
                              :port port))))

(defun halt ()
  (stop *websocket-acceptor*)
  (stop *acceptor*))

;; vm2014's apache uses 80/tcp. so it's ok to use 8080 and 8081.
(start-server 8080)
(start-websocket 8081)

