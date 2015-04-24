shogi-ai: shogi-ai.lisp
	sbcl --load $<

start: shogi-ai
	./shogi-ai 2>/dev/null &

stop:
	kill `ps ax | grep '[s]hogi-ai' | awk '{print $$1}'`

clean:
	${RM} *~ shogi-ai

