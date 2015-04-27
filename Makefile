# VERSION:

shogi-ai: shogi-ai.lisp
	sbcl --load shogi-ai.lisp \
		--eval "(in-package :shogi-ai)" \
		--eval "(sb-ext:save-lisp-and-die \"shogi-ai\" :executable t :toplevel 'main)"

start: shogi-ai
#	./shogi-ai 2>/dev/null &
	./shogi-ai

stop:
	kill `ps ax | grep '[s]hogi-ai' | awk '{print $$1}'`

init:
	if [ `uname` = "Linux" ]; then \
		install -m 0755 shogi-ai.service /etc/init.d/shogi-ai; \
		update-rc.d shogi-ai defaults; \
	else \
		@echo "no use on " `uname`;
	fi

clean:
	${RM} *.bak *~ shogi-ai

