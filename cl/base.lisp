
(defparameter *convert* 110)

(defstruct p
  name
  place
  prom
  moves)

(defstruct data
  board
  hand
  king
  rows)

(proclaim '(inline subst2 remove2 mappend))

(defun subst2 (to from lst)
  (let ((acc nil))
	(dolist (x lst)
	  (if (eq x from)
		  (push to acc)
		(push x acc)))
	(nreverse acc)))

(defun remove2 (elm lst)
  (let ((acc nil))
	(dolist (x lst)
	  (if (eq elm x)
		  nil
		(push x acc)))
	(nreverse acc)))

(defun mappend (fn lst)
  (loop for x in lst
	append (funcall fn x)))

;;
;;
;;

(proclaim '(inline db-aref))

(defun db-aref (id)
  (svref *all-states* id))

(proclaim '(inline pawn? king? hand? promed? umprom? empty? my-piece?))

(defun pawn? (piece)
  (eq (p-name piece) 0))

(defun king? (piece)
  (eq (p-name piece) 1300))

(defun hand? (piece)
  (zerop (p-place piece)))

(defun promed? (piece)
  (= 1 (p-prom piece)))

(defun umprom? (piece)
  (zerop (p-prom piece)))

(defun empty? (place array)
  (null (svref array place)))

(defun my-piece? (place array)
  (let ((piece (svref array place)))
	(and piece
		 (if (= 55 place)
			 (svref array 0)
		   (= place (p-place piece))))))

(proclaim '(inline row p-row line p-line board->array id->place ))

(defun row (place)
  (truncate place 10))

(defun p-row (piece)
  (row (p-place piece)))

(defun line (place)
  (mod place 10))

(defun p-line (piece)
  (line (p-place piece)))
  
(defun id->place (id)
  (mod id 100))

(defun board->array (mydata opdata)
  (let ((array (make-array 100 :initial-element nil)))
	(mapc (lambda (piece)
			(when (= 55 (p-place piece))
			  (setf (svref array 0) t))
			(setf (svref array (p-place piece))
				  piece))
		  (data-board mydata))
	(mapc (lambda (piece)
			(setf (svref array (- *convert* (p-place piece)))
				  piece))
		  (data-board opdata))
	array))

;;
;; function to chage data, move put take
;;

(proclaim '(inline inhand make-opdata make-mydata))

(defun inhand (piece)
  (db-aref (p-name piece)))

(defun make-opdata (taken opdata)
  (labels ((take (taken opdata)
			 (make-data
			  :board (remove2 taken (data-board opdata))
			  :hand  (data-hand opdata)
			  :rows  (if (pawn? taken)
						 (cons (p-row taken) (data-rows opdata))
					   (data-rows opdata))
			  :king  (when (not (king? taken))
					   (data-king opdata)))))
	(if taken
		(take taken opdata)
	  opdata)))
  
(defun make-mydata (to from taken mydata)
  (labels ((put (to from mydata)
			 (make-data
			  :board (cons to (data-board mydata))
			  :hand  (remove2 from (data-hand mydata))
			  :rows  (if (pawn? to)
						 (remove2 (p-row to) (data-rows mydata))
					   (data-rows mydata))
			  :king  (data-king mydata)))
		   (move (to from taken mydata)
			 (make-data
			  :board (subst2 to from (data-board mydata))
			  :hand  (if taken
						 (cons (inhand taken) (data-hand mydata))
					   (data-hand mydata))
			  :rows  (if (and (pawn? to) (promed? to) (umprom? from))
						 (cons (p-row to) (data-rows mydata))
					   (data-rows mydata))
			  :king  (if (king? to)
						 (p-place to)
					   (data-king mydata)))))
	(if (hand? from)
		(put to from mydata)
	  (move to from taken mydata))))

(proclaim '(inline flatten-moves legal? list-all-pieces))

(defun flatten-moves (moves array)
  (if (listp (car moves))
	  (let ((acc nil))
		(dolist (id moves)
		  (if (listp id)
			  (loop for i in id
				do (push i acc)
				while (empty? (id->place i) array))
			(push id acc)))
		acc)
	moves))

(defun legal? (to from mydata array)
  (let ((place (p-place to)))
	(if (hand? from)
		(if (pawn? from)
			(and (empty? place array)
				 (member (p-row to) (data-rows mydata)))
		  (empty? place array))
	  (not (my-piece? place array)))))

(defun list-all-pieces (data)
  (append (data-board data)
		  (remove-duplicates (data-hand data))))
