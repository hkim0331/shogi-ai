#how to dump?
shogi-ai: shogi-ai.lisp
	sbcl --load shogi-ai.lisp \
		--eval "(in-package :shogi-ai)" \
		--eval "(sb-ext:save-lisp-and-die \"shogi-ai\" :executable t :toplevel 'main)"

start: shogi-ai
#	./shogi-ai 2>/dev/null &
	./shogi-ai &

stop:
	kill `ps ax | grep '[s]hogi-ai' | awk '{print $$1}'`

clean:
	${RM} *~ shogi-ai

