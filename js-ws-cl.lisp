;; -*- coding: utf-8 -*-
;; hiroshi.kimura.0331@gmail.com, 2015-01-07.
;;
;; modified 2015-04-23, document-root


(ql:quickload :cl-who)
(ql:quickload :cl-json)
(ql:quickload :hunchentoot)
(ql:quickload :hunchensocket)

(defpackage :js-ws-cl
  (:use :cl :cl-who :cl-json :hunchentoot :hunchensocket))
(in-package :js-ws-cl)

(load "conector.lisp")

(defvar *acceptor* nil)

(defun start-server (port)
  (setf *acceptor*
        (start (make-instance
                'easy-acceptor
                :port port
                :document-root #P"/Users/hkim/Desktop/shogi-ai/"))))

(defun publish-static-content ()
    (push (create-static-file-dispatcher-and-handler
           "/index.html" "index.html") *dispatch-table*)
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
            (:body
             ,@body
             (:hr)
             (:p "programmed by hkimura, 2015-01-08.")))))

(define-easy-handler (js-ws-cl :uri "/js-ws-cl") ()
  (standard-page (:title "js-ws-cl")
    (:h1 "Websocket Example")
    (:ul
     (:li "JSON.stringify に任意の JSON データを入れて send すると、
それを受け取った CommonLisp が JSON データをパースし、
キーが x または y のものだけの連想リストを作ったあと、
そのリストを JSON に組み立て直し、返してくる。")
     (:li "CommonLisp での処理をもっとはっきりさせるために、
     現在時刻などを連想リストに入れてから戻すようにしたらどうか？")
     (:li "STAT: が CONNECT にならないときはポートを確認。
8000/tcp と 8001/tcp を使います。変更可。")
     (:li "CL returns: の初期値はクライアントのブラウザ情報。（いらんか）")
     (:li "現バージョンは JSON 以外のデータを入力するとエラー終了する。
再読み込みで復活する。"))
    (:hr)
    (:div
     (:p "STAT:" (:span :id "stat")))
    (:div
     (:p "ERROR:" (:span :id "error")))
    (:div
     (:p "JSON.stringify("
         (:input
          :id :js
          :type "text" :size 40
          :value "{\"x\":4, \"y\":[1,2,3], \"doc\":\"only x, y returns\"}"
          ) ")"
         (:button :id "send" :onClick "toCL()" "send")))
    (:div
     (:p "CL returns:"
         (:span :id "cl" " ")))
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
(defun main ()
  (start-server 8880)
  (start-websocket 8881)
  ;; 起動を維持するために無限ループする
  (loop (sleep 60)))

(sb-ext:save-lisp-and-die "shogi-ai" :executable t :toplevel 'main)

