var wsUri = "ws://localhost:8081/downup";
var output;

var downX;
var downY;

document.onmousedown = mouseDown;
document.onmouseup = mouseUp;

function init() {
    output   = document.getElementById("output");
    sent     = document.getElementById("sent");
    received = document.getElementById("received");
    x      = document.getElementById("x");
    y      = document.getElementById("y");
    op     = document.getElementById("op");
    z      = document.getElementById("z");
    testWebSocket();
}

function mouseDown(event) {
    downX = event.clientX;
    downY = event.clientY;
}

function mouseUp(event) {
    var data = {"event":"mouse",
                "from":[downX, downY],
                "to":[event.clientX, event.clientY]};
    doSend(JSON.stringify(data));
    // こう書くとエラー。
    // doSend(JSON.stringify({"from": [downX, downY], "to": [event.clientX, event.clientY]});
}

function testWebSocket() {
    websocket         = new WebSocket(wsUri);
    websocket.onopen  = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {
    writeTo(output,   "CONNECTED");
    writeTo(sent,     "please drag any place");
    writeTo(received, "answer from LISP will appear here");
}

function onClose(evt) {
    writeTo(output, "DISCONNECTED");
}

function onMessage(evt) {
    writeTo(received, evt.data);
}

function onError(evt) {
    writeTo(output, "ERROR: " + evt.data);
}

function doSend(message) {
    writeTo(sent, message);
    websocket.send(message);
}

function writeTo(id, message) {
    id.innerHTML = message;
}

window.addEventListener("load", init, false);

