(defparameter *home-path* "/home/katou/public_html/cl")

(mapc (lambda (file)
		(load (concatenate 'string
						   *home-path*
						   file)))
	  '("/make-data-init.lisp"
		"/make-evalfn.lisp"
		"/base.lisp"
		"/alpha-beta-searcher.lisp"
		"/data/all-states.lisp"
		"/data/value.lisp"
		))

(defparameter *eval-fn*  (make-evalfn (first *value*) (second *value*)))
(defparameter *depth*    4)
(defparameter *data-cpu* (make-data-init))
(defparameter *data-man* (make-data-init))

(defun name->jp (name)
  (case name
	(0    "fu")
	(200  "ky")
	(400  "ke")
	(600  "gi")
	(800  "ki")
	(900  "ka")
	(1100 "hi")
	(1300 "ou")))

;; (defun move->js-array (to from)
;;   (format nil
;; 		  "[~a,~a,'~a',~a,~a,'~a']"
;; 		  (p-row  from)
;; 		  (p-line from)
;; 		  (name->jp (p-name from))
;; 		  (p-row  to)
;; 		  (p-line to)
;; 		  (if (zerop (p-prom to)) 'n 't)))

(defun move->js-array (to from)
  (list (p-row  from)
        (p-line from)
        (name->jp (p-name from))
        (p-row  to)
        (p-line to)
        (if (zerop (p-prom to)) 'n 't))
  )

(defun cpu ()
  #'(lambda (mydata opdata)
	  (let* ((move (funcall (alpha-beta-searcher *depth*
												 *eval-fn*)
							mydata
							opdata))
			 (to    (car move))
			 (from  (cdr move))
			 (arr   (board->array mydata opdata))
			 (taken (aref arr (p-place to))))
		(values (make-mydata to from taken mydata)
				(make-opdata taken opdata)
				(move->js-array to from)))))

(defun movable? (place prom piece arr)
  (member (+ place (* 100 prom) (p-name piece))
		  (flatten-moves (p-moves piece) arr)))

(defun convert (place)
  (- 110 place))
   
(defmacro case-string (str &body body)
  (let ((expr (first body)))
	(if (null body)
		nil
	  `(if (string-equal ,str ,(first expr))
		   ,(second expr)
		 (case-string ,str ,@(rest body))))))

(defun jp->num (jp)
  (case-string jp
	("fu" 0)
	("ky" 200)
	("ke" 400)
	("gi" 600)
	("ki" 800)
	("ka" 900)
	("hi" 1100)
	("ou" 1300)))

(defun man (from to prom name)
  #'(lambda (opdata mydata)
	  (let ((piece (if (not (< 11 from 99))
					   (find-if (lambda (x)
								  (eq (jp->num name) (p-name x)))
								(data-hand mydata))
					 (find-if (lambda (x)
								(eq from (p-place x)))
							  (data-board mydata))))
			(arr (board->array mydata opdata)))
		(cond
		 ((null piece) "such piece not exist")
		 (t (let* ((id    (+ to (* 100 prom) (p-name piece)))
				   (to    (db-aref id))
				   (from   piece)
				   (taken (aref arr (p-place to))))
			  (values (make-opdata taken opdata)
					  (make-mydata to from taken mydata)
					  nil)))))))

(defun initialize ()
  (setf *data-cpu* (make-data-init))
  (setf *data-man* (make-data-init)))

(defun updata (fn)
  (multiple-value-bind (data-cpu data-man result)
	  (funcall fn *data-cpu* *data-man*)
	(when (and data-cpu
			   data-man)
	  (setf *data-cpu* data-cpu
			*data-man* data-man))
	result))

(initialize)

