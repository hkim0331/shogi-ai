var wsUri = "ws://vm2014.local:8001/js-ws-cl";

var stat;
var js;
var cl;

function init() {
    stat = document.getElementById("stat");
    js   = document.getElementById("js");
    cl   = document.getElementById("cl");
    initWebSocket();
}

function initWebSocket() {
    ws           = new WebSocket(wsUri);
    ws.onopen    = function(evt) { onOpen(evt) };
    ws.onclose   = function(evt) { onClose(evt) };
    ws.onmessage = function(evt) { onMessage(evt) };
    ws.onerror   = function(evt) { onError(evt) };
}

function onOpen(evt) {
    writeTo(stat, "CONNECTED");
}

function onClose(evt) {
    writeTo(stat, "DISCONNECTED");
}

function onMessage(evt) {
    writeTo(cl, evt.data);
}

function onError(evt) {
    writeTo(error, evt.data);
}

function doSend(message) {
    ws.send(message);
}

function writeTo(id, message) {
    id.innerHTML = message;
}

function toCL() {
    var js;
    js = document.getElementById("JS").value;
    doSend(js);
}

window.addEventListener("load", init, false);


