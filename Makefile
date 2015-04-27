#how to dump?
shogi-ai: shogi-ai.lisp
	sbcl \
		--load shogi-ai.lisp \
		--eval "(sb-ext:save-lisp-and-die \"shogi-ai\" :executable t :toplevel 'main)" \
		--eval "(quit)"

start: shogi-ai
#debug
#	./shogi-ai 2>/dev/null &
	./shogi-ai 

stop:
	kill `ps ax | grep '[s]hogi-ai' | awk '{print $$1}'`

clean:
	${RM} *~ shogi-ai

