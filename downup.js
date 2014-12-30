var downX;
var downY;

var wsUri = "ws://localhost:8081/downup";
var output;

document.onmousedown = mouseDown;
document.onmouseup = mouseUp;

function init() {
    output   = document.getElementById("output");
    sent     = document.getElementById("sent");
    received = document.getElementById("received");
    testWebSocket();
}

function mouseDown(event) {
    downX = event.clientX;
    downY = event.clientY;
}

function mouseUp(event) {
    var data = {"from": [downX, downY],
                "to": [event.clientX, event.clientY] };
    doSend(JSON.stringify(data));
}

function testWebSocket() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
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
    writeTo(output,"DISCONNECTED");
}

function onMessage(evt) {
    writeTo(received,'<span style="color: blue;">' + evt.data+'</span>');
}

function onError(evt) {
    writeTo(output,'<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
    writeTo(sent,"SENT: " + message);
    websocket.send(message);
}

function writeTo(id, message) {
    id.innerHTML = message;
}

window.addEventListener("load", init, false);

