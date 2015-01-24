
(defstruct value
  pawn spear knight silver gold rook bishop king)

(proclaim '(inline sum-of name->value value-name value-place))

(defun sum-of (fn &rest lsts)
  (let ((sum 0))
	(dolist (lst lsts)
	  (dolist (x lst)
		(incf sum (funcall fn x))))
	sum))

(defun name->value (name value)
  (case name
	(0    (value-pawn   value))
	(200  (value-spear  value))
	(400  (value-knight value))
	(600  (value-silver value))
	(800  (value-gold   value))
	(900  (value-bishop value))
	(1100 (value-rook   value))
	(1300 (value-king   value))
	(otherwise (value-gold value))))

(defun value-name (piece value-name)
  (name->value (p-name piece) value-name))

(defun value-place (piece king-row king-line value-place)
  (if (hand? piece)
	  0
	(let ((id (- 144
				 (- (p-row  piece) king-row)
				 (* 17 (- king-line (p-line piece)))))
		  (array (name->value (p-name piece) value-place)))
	  (svref array id))))

(defun make-evalfn (value-name value-place)
  #'(lambda (mydata opdata)
	  (let ((king-row  (row  (data-king opdata)))
			(king-line (line (data-king opdata))))
		(sum-of (lambda (piece)
				  (+ (value-name  piece value-name)
					 (value-place piece king-row king-line value-place)))
				(data-board mydata)
				(data-hand  mydata)))))
