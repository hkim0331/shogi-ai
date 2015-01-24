logId = 500;
oldLogStack = new Array();
newLogStack = new Array();
showLogFlag = 0;
function addlog(oldId, newId, koma) {
	if (showLogFlag == 0) {
		var oldPoint = { x: getXById(oldId), y: getYById(oldId) };
		var newPoint = { x: getXById(newId), y: getYById(newId) };
		koma = getKomaNameByFilename(koma);
		var g = createGElement(990, 70, 0.5, logId);
		g.appendChild(createImageElement(60, 0, undefined, 'font/' + Math.floor(newId / 10)));
		g.appendChild(createImageElement(100, 0, undefined, ('font/' + newId % 10) + newId % 10));
		g.appendChild(createImageElement(150, 0, undefined, koma));
		oldLogStack.push(g);
		logId++;
	} else {
		if (!(newLogStack[0] == undefined)) {
			callNowLog();
		}
		var oldPoint = { x: getXById(oldId), y: getYById(oldId) };
		var newPoint = { x: getXById(newId), y: getYById(newId) };
		koma = getKomaNameByFilename(koma);
		var g = createGElement(990, 210, 0.5, logId);
		if (document.getElementById(logId - 5)) {
			oldLogStack.push(document.getElementById(logId - 5));
			removeById(logId - 5);
			active('beforeIcon');
		}
		upLogs();
		addNewLog(g, newId, koma);
		logId++;
	}
}

function createGElement(x,y, scale,id) {
	var g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
	g.setAttribute('transform', 'translate(' + x + ',' + y + ') scale(' + scale + ')');
	g.id = id;
	return g;
}

function upLogs() {
	var gElms = document.getElementsByTagName('g');
	for (var i=0;; i++) {
		var targetElement = gElms.item(i);
		if (!(targetElement == null)) {
			var transform = targetElement.getAttribute('transform');
			var y = parseInt(getYByTransform(transform));
			var newTransform = changeTransformByY(transform, y-35);
			targetElement.setAttribute('transform',newTransform);
		}else{
			break;
		}
	}
}

function downLogs() {
	var gElms = document.getElementsByTagName('g');
	for (var i=0;; i++) {
		var targetElement = gElms.item(i);
		if (!(targetElement == null)) {
			var transform = targetElement.getAttribute('transform');
			var y = parseInt(getYByTransform(transform));
			var newTransform = changeTransformByY(transform, y+35);
			targetElement.setAttribute('transform',newTransform);
		}else{
			break;
		}
	}
}

function getYByTransform(string) {
	var strlen = getYLength(string);
	return string.substr(14,strlen);
}

function getYLength(string) {
	for (var i = 14; ; i++) {
		if (string.substr(i, 1) == ')') {
			return i - 14;
		}
	}
}

function changeTransformByY(transform, y) {
	return transform.substr(0, 14) + y + ') scale(0.5)';
}

function createImageLogElement(x,y,id,fileName){
	var image = document.createElementNS('http://www.w3.org/2000/svg','image');
	image.setAttributeNS(null,'x',x);
	image.setAttributeNS(null, 'y', y);
	if (fileName == 'font/waku') {
		image.setAttribute('width', 150);
	} else {
		image.setAttributeNS(null, 'width', 16);
	}
	if(fileName=='font/nowLog'){
		image.setAttributeNS(null,'height',16);
	}else if(fileName=='font/addLog'){
		image.setAttributeNS(null,'height',15);
	}else if(fileName=='font/waku'){
		image.setAttribute('height', 200);
	}else{
		image.setAttributeNS(null,'height',60);
	}
	image.setAttributeNS(null,'id',id);
	image.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',fileName+'.svg');
	return image;
}

function appendAddIcon() {
		var addIcon = createImageLogElement(895, 0, 'addIcon', 'font/addLog');
		addIcon.setAttribute('opacity', '0.3');
		addIcon.setAttribute('onclick', 'switchLog()');
		SVGappendChildByElement(addIcon);
}

function switchLog(){
	if (showLogFlag == 0) {
		for (var i = 0; i < 5; i++) {
			var logElement = oldLogStack.pop();
			if(!(logElement==undefined)){
				logElement.setAttribute('transform',changeTransformByY(logElement.getAttribute('transform'),210-i*35));
				SVGappendChildByElement(logElement);
			}
		}
		appendMoveLogIcon();
		if (logId > 504) {
			active('beforeIcon');
		}
		showLogFlag = 1;
	} else {
		callNowLog();
		for(var i= 0;i<5;i++){
			var olderLogId = getBiggerLogId() - 4;
			var targetId = olderLogId + i;
			var target=document.getElementById(targetId);
			if (!(target == undefined)) {
				target.setAttribute('transform',changeTransformByY(target.getAttribute('transform'),70));
				oldLogStack.push(target);
				removeById(targetId); 
			}
		}
		removeMoveLogIcon();
		showLogFlag=0;
	}
}

function appendMoveLogIcon() {
	var waku = createImageLogElement(1000, 55, 'waku', 'font/waku');
	waku.setAttribute('opacity', '0.3');
	SVGappendChildByElement(waku);
	var beforeIcon=createImageLogElement(1110, 75, 'beforeIcon', 'font/beforeLog');
	var nowIcon = createImageLogElement(1110, 147, 'nowIcon', 'font/nowLog');
	var afterIcon = createImageLogElement(1110, 175, 'afterIcon', 'font/afterLog');
	beforeIcon.setAttribute('opacity', '0.3');
	nowIcon.setAttribute('opacity', '0.3');
	afterIcon.setAttribute('opacity', '0.3');
	SVGappendChildByElement(afterIcon);
	SVGappendChildByElement(beforeIcon);
	SVGappendChildByElement(nowIcon);
	var addIcon = document.getElementById('addIcon');
	removeById(addIcon);
	SVGappendChildByElement(addIcon);
}

function removeMoveLogIcon() {
	removeById('waku');
	removeById('beforeIcon');
	removeById('nowIcon');
	removeById('afterIcon');
}

function removeLogs() {
	var gElements = document.getElementsByTagName('g');
	for (var i = 0; ; i++) {
		if (gElements.item(i) == null) {
			break;
		} else {
			document.getElementsByTagName('svg').item(0).removeChild(gElements.item(i));
		}
	}
}



function addNewLog(g,newId,koma) {
	g.appendChild(createImageElement(60, 0, undefined, 'font/' + Math.floor(newId / 10)));
	g.appendChild(createImageElement(100, 0, undefined, ('font/' + newId % 10) + newId % 10));
	g.appendChild(createImageElement(150, 0, undefined, koma));
	SVGappendChildByElement(g);
}

function logIdClos() {
	var x = 500;
	return function () {
		x = x + 1;
		return x;
	}
}

function getBiggerLogId(){
	for(var i=logId;i>=500;i--){
		if(document.getElementById(i)){
			return i;
		}
	}
}

function callOlderLog() {
	var newerLogId=getBiggerLogId();
	newLogStack.push(document.getElementById(newerLogId));
	removeById(newerLogId);
	downLogs();
	var oldLog=oldLogStack.pop();
	SVGappendChildByElement(oldLog);
	active('afterIcon');
	active('nowIcon');
	if(getBiggerLogId()<505){
		anactive('beforeIcon');
	}
}

function callNewerLog() {
	var olderLogId=(getBiggerLogId()-4);
	oldLogStack.push(document.getElementById(olderLogId));
	removeById(olderLogId);
	upLogs();
	var newLog=newLogStack.pop();
	SVGappendChildByElement(newLog);
	active('beforeIcon');
	if((getBiggerLogId()+1)==logId){
		anactive('afterIcon');
		anactive('nowIcon');
	}
}

function callNowLog() {
	var newerLogId = getBiggerLogId();
	var olderLogId = newerLogId - 4;
	oldLogStack.push(document.getElementById(olderLogId));
	removeById(olderLogId); 
	for (var i = 0; i < 4; i++) {
		if (document.getElementById(newerLogId - i)) {
			newLogStack.push(document.getElementById(newerLogId - i));
			removeById(newerLogId - i);
		}
	}
	for(;;){
		if (!(newLogStack[5] == undefined)) {
			var tmp = newLogStack.pop();
			tmp.setAttribute('transform',changeTransformByY(tmp.getAttribute('transform'),70));
			oldLogStack.push(tmp);
		} else {
			for(var i=0;i<5;i++){
				var elm = newLogStack.pop();
				if (!(elm == null)) {
					elm.setAttribute('transform', changeTransformByY(elm.getAttribute('transform'),( 70 + i * 35)));
					SVGappendChildByElement(elm); 
				}
			}
			break;
		}
	}
}

function setActive1(){
	anactive('afterIcon');
	anactive('nowIcon');
	active('beforeIcon');
}

function active(idName){
	var target = document.getElementById(idName);
	if(idName=='afterIcon'){
		target.addEventListener('click',callNewerLog,false);
	}else if(idName=='beforeIcon'){
		target.addEventListener('click',callOlderLog,false);
	}else{
		target.addEventListener('click', callNowLog, false);
		target.addEventListener('click', setActive1, false);
	}
	target.setAttribute('opacity', '0.8');
}


function anactive(idName){
	var target=document.getElementById(idName);
	if(idName=='afterIcon'){
		target.removeEventListener('click',callNewerLog,false);
	}else if(idName=='beforeIcon'){
		target.removeEventListener('click',callOlderLog,false);
	}else{
		target.removeEventListener('click',callNowLog,false);
		target.removeEventListener('click', setActive1, false);
	}
	target.setAttribute('opacity', '0.3');
}

function sim(from, koma, to,nArg) {
	if (nArg==undefined) {
		var nFlag = 'n';
	} else {
		var nFlag = 't';
	}
	var array = new Array(Math.floor(from/10), (from%10), koma, Math.floor(to/10), (to%10), nFlag);
	var simMessage = { data: array };
	movePlayer2Koma(simMessage);
}
