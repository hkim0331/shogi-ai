(defparameter max-value  400000)
(defparameter min-value -400000)

(defun alpha-beta (mydata opdata alpha beta depth eval-fn)
  (cond
   ((zerop depth) (funcall eval-fn mydata opdata))
   ((null (data-king mydata)) (if (evenp depth)
								  (funcall eval-fn mydata opdata)
								min-value))
   (t (let ((best-move nil)
			(array (board->array mydata opdata)))
		(loop for from in (list-all-pieces mydata)
		  do (loop for id in (flatten-moves (p-moves from) array)
			   for to = (db-aref id)
			   when (legal? to from mydata array) 
			   do (let* ((taken (svref array (p-place to)))
						 (val (- (alpha-beta (make-opdata taken opdata)
											 (make-mydata to from taken mydata)
											 (- beta)
											 (- alpha)
											 (1- depth)
											 eval-fn))))
					(when (null best-move)
					  (setf best-move (cons to from)))
					(when (> val alpha)
					  (setf alpha val)
					  (setf best-move (cons to from))))
			   until (>= alpha beta))
		  until (>= alpha beta))
		(values alpha best-move)))))

(defun alpha-beta-searcher (depth eval-fn)
  #'(lambda (mydata opdata)
	  (multiple-value-bind (value move)
		  (alpha-beta mydata opdata min-value max-value depth eval-fn)
		(declare (ignore value))
		move)))