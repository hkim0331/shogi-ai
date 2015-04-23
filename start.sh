#!/bin/sh

./shogi-ai
./server --root .
sbcl --script req.lisp 8888
