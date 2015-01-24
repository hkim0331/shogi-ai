
(defparameter *places-init*
  '((pawn   13 23 33 43 53 63 73 83 93)
	(spear  11 91)
	(knight 21 81)
    (silver 31 71)
    (gold   41 61)
	(rook   82)
    (bishop 22)
	(king   51)))

(defun ssoc (elm lst)
  (rest (assoc elm lst)))

(defun make-data-init ()
  (let* ((names '(pawn spear knight silver gold bishop rook king))
		 (board (mappend (lambda (name)
						   (let ((id (* 100 (position name
													  '(pawn 0 spear 0 knight 0 silver 0 gold bishop 0 rook 0 king)))))
							 (mapcar (lambda (place)
									   (db-aref (+ id place)))
									 (ssoc name *places-init*))))
						 names)))
	(make-data
	 :board board
	 :hand  nil
	 :rows  nil
	 :king  51)))
