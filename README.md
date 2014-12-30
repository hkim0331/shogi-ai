# downup

JavaScript/CommonLisp の hunchentoot/hunchensocket を使用した
WebSocket 通信プログラムサンプル。

## require

* Clozure-CL (or sbcl)
* quicklisp
* cl-who
* hunchentoot
* hunchensocket

## usage

````
$ ccl --load downup.lisp
````

## FIXME

* ql:quickload のタイミング
* find-action あたり。直接 *websocket-dispatch-table* にプッシュじゃまずいのか？
* huncheksocket:client-connected, client-disconnected, text-message-received はどんなメソッドか？デリゲートと思っていいのか？


