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
    writeToScreen("CONNECTED");
    writeToSent("please drag any place");
    writeToReceived("answer from LISP will appear here");
}

// function onClick(evt) {
//     doSend("son of a bitch");
// }

function onClose(evt) {
    writeToScreen("DISCONNECTED");
}

function onMessage(evt) {
    writeToReceived('<span style="color: blue;">' + evt.data+'</span>');
}

function onError(evt) {
    writeToScreen('<span style="color: red;">ERROR:</span> ' + evt.data);
}

function doSend(message) {
    writeToSent("SENT: " + message);
    websocket.send(message);
}

function writeToScreen(message) {
    output.innerHTML = message;
}

function writeToSent(message) {
    sent.innerHTML = message;
}

function writeToReceived(message) {
    received.innerHTML = message;
}

window.addEventListener("load", init, false);

