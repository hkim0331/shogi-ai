#!/usr/bin/env dash
# -*- mode: Shell-script; coding: utf-8; -*-

if [ ! $# = 1 ]; then
    echo usage: $0 VERSION
    exit
fi
VERSION=$1
TODAY=`date +%F`

if [ `uname` = 'Darwin' ]; then
    SED=/usr/local/bin/gsed
else
    SED=sed
fi

LISP="shogi-ai.lisp"
for i in ${LISP}; do
    echo $i
    ${SED} -i.bak "/^#;; VERSION:/ c\
;; VERSION: ${VERSION}" $i
done

JS="websocket.js"
for i in ${JS}; do
    echo $i
    ${SED} -i.bak "/^#\/\/ VERSION:/ c\
// VERSION: ${VERSION}" $i
done

CONF="Makefile Vagrantfile nginx/sites-available/shogi-ai"
for i in ${CONF}; do
    echo $i
    ${SED} -i.bak  "/^# VERSION:/ c\
# VERSION: ${VERSION}" $i
done

echo ${VERSION} > VERSION


