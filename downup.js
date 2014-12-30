var downX;
var downY;

var wsUri = "ws://localhost:8081/downup";
var output;

document.onmousedown = mouseDown;
document.onmouseup = mouseUp;

function mouseDown(event) {
    downX = event.clientX;
    downY = event.clientY;
}

function mouseUp(event) {
    var data = {"from": [downX, downY],
                "to": [event.clientX, event.clientY] };
    doSend(JSON.stringify(data));
}

function init() {
    output = document.getElementById("output");
    testWebSocket();
}

function testWebSocket() {
    websocket = new WebSocket(wsUri);
    websocket.onopen = function(evt) { onOpen(evt) };
    websocket.onclose = function(evt) { onClose(evt) };
    websocket.onmessage = function(evt) { onMessage(evt) };
    websocket.onerror = function(evt) { onError(evt) };
}

function onOpen(evt) {
    writeToScreen("CONNECTED");
    doSend("please drag any place");
}

function onClick(evt) {
    doSend("son of a bitch");
}

function onClose(evt) {
    writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
    writeToScreen('<span style="color: blue;">MOUSE DRAGGED: ' + evt.data+'</span>');
}

function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
    writeToScreen("SENT: " + message);
    websocket.send(message);
}

function writeToScreen(message) {
    output.innerHTML = message;
}

window.addEventListener("load", init, false);

