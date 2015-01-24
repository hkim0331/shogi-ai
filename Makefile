start:
	/usr/local/bin/ccl --load downup.lisp

stop:

nmap:
	nmap localhost -p 8080,8081

clean:
	${RM} *~

