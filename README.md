# shogi-ai

## 2.1 nginx reverse proxy

しかし、これだと、別の websocket アプリと両立しないだろう。

```
   location / {
         proxy_pass http://127.0.0.1:20141/;
   }
```

## 2.0

vagrant(ubuntu/trusty64) で出直し。

* ファイルの属性
* Makefile
* bump_version.sh


---
このプログラムの元は、common lisp で websocket の実験をするための js-ws-cl.lisp だった。
そのファイル名がそのまま残っている。

---

## INSTALL(OLD)

このフォルダのコピー先を js-ws-cl.lisp の :document-root に指定すること。

````lisp
(defun start-server (port)
  (setf *acceptor*
        (start (make-instance
                'easy-acceptor
                :port port
                :document-root #P"/Users/hkim/Desktop/shogi-ai/"))))
````

あとは

````
$ make
$ make start
````

で起動。ブラウザから http://localhost:8880 でつながる。終了は、

````
$ make stop
````

# was downup

JavaScript/CommonLisp の hunchentoot/hunchensocket を使用した
WebSocket 通信プログラムサンプル。

## version

0.3.1, 2015-01-06.

## require

* Clozure-CL or SBCL
* quicklisp
* cl-who
* cl-json
* hunchentoot
* hunchensocket

## usage

````
$ ccl (or sbcl)
CCL> (load "downup.lisp")
````

Open http://localhost:8080/downup, then click or drag your mouse on the page.
Other example (GET,POST,form) shown bellow.

## FIXME

* An example calc at the bottom of the window is not complete.
use of 'onclik' in JS is not good?

