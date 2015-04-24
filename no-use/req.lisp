(load "ql")

(ql:quickload "usocket")

(defun ipaddr->int (lst)
  (labels ((aux (l ret)
             (if (null l)
               ret
               (aux (cdr l) (+ (* ret 256) (car l))))))
    (aux lst 0)))

(defvar *server-name* (ipaddr->int '(127 0 0 1)))
(defvar *server-port* 2000)
(defvar *ws-port* 8881)
(defvar *port* (parse-integer (cadr *posix-argv*)))
(defvar *server* nil)

(defun string-split (cs str)
  (let ((i (position-if (lambda (c) (member c cs)) str)))
    (if i
      (cons (subseq str 0 i) (string-split cs (subseq str (+ i 1))))
      (list str))))

(defun my-read-line (str)
  (let ((c (read-char str nil nil)))
    (cond
      ((null c) "")
      ((char= #\return c)
       (read-char str nil nil)
       "")
      (t (format nil "~C~A" c (my-read-line str))))))

(defun read-header (str)
  (let ((l (my-read-line str)))
    (if (string= l "")
      (format nil "~c~c" #\return #\linefeed)
      (format nil "~A~c~c~A" l #\return #\linefeed (read-header str)))))

(defun send-bytes (src dst n)
  (loop for i from 0 below n
        do (write-byte (or (read-byte src nil nil) #X20) dst)))

(defun read-content-length (header)
  (let* ((lines (string-split '(#\return #\linefeed) header))
         (lsts (mapcar (lambda (line)
                         (string-split '(#\space) line))
                       lines))
         (cl (remove-if-not (lambda (lst)
                              (string= (car lst) "Content-Length:"))
                            lsts)))
    (if cl
      (parse-integer (cadar cl)))))

(defun req-of-ws? (req)
  (member "Upgrade: websocket" (string-split '(#\return #\linefeed) req)))

(defun send-data (cli)
  (let ((header (read-header cli)))
    (if (req-of-ws? header)
      (setf *server*
            (usocket:socket-stream
              (usocket:socket-connect *server-name* *ws-port* :element-type :default)))
      (setf *server*
            (usocket:socket-stream
              (usocket:socket-connect *server-name* *server-port* :element-type :default))))
    (format *server* "~a" header)
    (let ((cl (read-content-length header)))
      (if cl
        (send-bytes cli *server* cl))))
  (force-output *server*))

(defun receive-data (src dst)
  (let ((header (read-header src)))
    (format dst "~a" header)
    (let ((cl (read-content-length header)))
      (if cl
        (send-bytes src dst cl))))
  (force-output dst))

(defun send-req (cli)
  (send-data cli)
  (print "data sent")
  (force-output)
  (receive-data *server* cli)
  (print "data received")
  (force-output)
  (close *server*)
  (close cli))

(defun serve (port)
  (let ((socket (usocket:socket-listen usocket:*wildcard-host* port :reuseaddress t)))
    (unwind-protect
      (loop (let ((cli (usocket:socket-stream
                         (usocket:socket-accept socket
                                                :element-type :default))))
              (send-req cli)))
      (usocket:socket-close socket))))

(defun main ()
  (serve *port*))

(main)
;(sb-ext:save-lisp-and-die "shougi" :executable t :toplevel 'main)
