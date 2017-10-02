# shogi-ai

PBL 2014 受講生が LISP 歴半年でゼロから作った対戦型将棋ゲーム。

アルファベータ法？で n て先読み、ゲームを進めます。
盤面、将棋の駒は SVG　で独自にデザイン、
駒の動きのアニメーションは JavaScript でプログラムしています。
WebSocket 通信使います。

既知のバグは、

* 王様が取られてもゲームが続く場合がある。
* 二歩を妨げない。

でも、LISP を初めて半年やそこらでこれはすごいと思う。
バカな<strike>先生</strike>おっと、人たちは理解できないようだが。

プログラムを作った5人の学生（主に二人だな）は別の研究室に進み、
私の研究室を希望した学生は成績不足で別の研究室に回され、
彼の代わりにやって来た学生が問題児だったことは誰かは知ってる、
卒業してそれぞれの分野に進みました。
というわけでプログラムをメンテする人はいませんが、
後に続く PBL 受講生のために GitHub 使わせてもらいます。

## 3.0

別サイトにインストールするときは、websocket.js の先頭にある uri を調整すること。

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

