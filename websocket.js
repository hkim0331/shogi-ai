// �ړ��ł���ꏊ��I����ɏ��𑗐M
window.onload = function () {
	ws = new WebSocket('ws://vm2014.melt.kyutech.ac.jp:8881/js-ws-cl');
	ws.onopen = function () { console.log('connect');setWSflag();selectSenkou();};
	ws.onmessage = function (event) { movePlayer2Koma(event); };
	window.onunload = function () { closeWS(); };
    ws.onclose=function(){console.log(4);};
ws.onerror=function(error){console.log(error);};
	appendAddIcon();
}

function selectSenkou(){
	var flg = confirm('you first?');
	if(flg){
		sendMessage('init',0);
	}else{
		setTurnFlg();
		sendMessage('init',1);
	}
}

function removeKoma(player,moveId){
        appendPlayerMotikomaByOpponentKomaId(player, moveId);
        removeById(moveId);
}

function appendAnimateElement(fromId,toId){
	var animateX = createAnimateXElement(getXById(fromId),getXById(toId));
	var animateY = createAnimateYElement(getYById(fromId),getYById(toId));
	var target = document.getElementById(fromId);
	target.appendChild(animateX);
	target.appendChild(animateY);
}

function startAnimation(fromId) {
	var animateElements = document.getElementById(fromId).getElementsByTagName('animate');
	animateElements.item(0).beginElement();
	animateElements.item(1).beginElement();
}

function getJsFlagByLispFlag(flag){
	if (flag == 't') {
		return true;
	} else {
		return false
	}
}

function renewKoma(id) {
	var image = document.getElementById(id);
	SVGappendChildByElement(image);
}

// player2�̋�𓮂���
function movePlayer2Koma(event) {
    //FIXME: data ����Ȃ���� return
    console.log(event.data);
    var obj = JSON.parse(event.data);
    var ary = obj.answer;
    if ((typeof(ary)=='string')||(ary == null)) return;
    var mArray = ary;
console.log(mArray);
    var oldKomaPlayer2Id = getOldPlayer2KomaId(mArray[0] * 10 + mArray[1], mArray[2]);
    var newKomaX = mArray[3];
    var newKomaY = mArray[4];
    var moveId = newKomaX * 10 + newKomaY;
    var putKoma = getPutKoma(mArray[2], mArray[5]);

    renewKoma(oldKomaPlayer2Id);
    appendAnimateElement(oldKomaPlayer2Id, moveId);
    startAnimation(oldKomaPlayer2Id);
	setTimeout(function(){removeById(oldKomaPlayer2Id);},2000);
	setTimeout(function(){appendKomaToId(putKoma.toUpperCase(), moveId + 200);},2000);

    if (ifThereIsKoma(moveId)) {
		setTimeout(function(){removeKoma(2,moveId);},2000);
    }
    setTimeout(function () { addlog(mArray[0] * 10 + mArray[1], moveId, putKoma); }, 2000);
    setTimeout(function () { resetTurnflag(); }, 2000);
    setTimeout(function (moveId) { checkOu(moveId); }, 2001);
}

function checkOu(newId){
	if (ifThereIsKoma(newId)) {
		var opponentKoma = document.getElementById(newId).getAttribute('xlink:href');
		if((opponentKoma.toUpperCase())=='OU2.SVG'){
			alert('you lose');
		}
	}
}

// 
function getOldPlayer2KomaId(id,koma){
    if (id == 0) {
	for (var i = 401; i < 600; i++) {
	    if (document.getElementById(i)) {
		if (getKomaNameById(i).substr(0, 2) == koma) {
		    return i;
		}
	    }
	}
    } else {
	return id+200;
    }
}

// id
function getKomaFilenameById(id) {
    return document.getElementById(id).getAttribute('xlink:href').toLowerCase();
}
 
function getKomaNameById(id) {
    return getKomaNameByFilename(getKomaFilenameById(id));
}

// id�̈ʒu�ɋ��ǉ�
function appendKomaToId(komaName,id){
	var x = getXById(id);
	var y = getYById(id);
	var image = createImageElement(x,y,id,komaName);
	SVGappendChildByElement(image);
}

// �Ƃ������player�̎���ɒǉ�
function appendPlayerMotikomaByOpponentKomaId(player, opponentKomaId) {
    var removeKomaName = getKomaNameById(opponentKomaId).toUpperCase();
	var motikomaName = changeMotikomaNameByPlayer(removeKomaName,player);
	appendKomaToId(motikomaName,getEmptyMotikomaIdByPlayer(player));

}

// �ړ�������̋���擾
function getPutKoma(movekoma,nariflag){
	if(nariflag=='n'){
		return movekoma+'2';
	}else{
		return '-'+movekoma+'2';
	}
}

// ��̖��O���v���C���[�ɂ���ĕς���
function changeMotikomaNameByPlayer(koma,player){
	if(koma.substr(0,1)=='-'){
		return koma.substr(1,2)+player;
	}else{
		return koma.substr(0,2)+player;
	}
}

// ��:�ufu1.svg�v����ufu1�v���擾
function getKomaNameByFilename(Fname){
	if(Fname.substr(0,1)=='-'){
		return Fname.substr(0,4);
	}else{
		return Fname.substr(0,3);
	}
}

// player�̎���̋�id���擾
function getEmptyMotikomaIdByPlayer(player){
	if(player==1){
		var cmpId = 301;
	}else if(player==2){
		var cmpId = 401;
	}
	for(var i=0;i<100;i++){
        if((i%10)>3){i+=6;}
		if(!(document.getElementById(cmpId+i))){
			return cmpId+i;
        }
	}
}

// id�̗v�f���폜
function removeById(id){
	var element = document.getElementById(id);
	if (!(element == undefined)) {
		element.parentNode.removeChild(element);
	}
}

// id������x�ʒu���擾
function getXById(id){
	if(id<100){
		return 880-Math.floor(id/10)*60;
	}else if((id>200)&&(id<300)){
		return 880-Math.floor((id-200)/10)*60;
	}else if((id>300)&&(id<400)){
		return (((id-300)%10)*60)+885;
	}else if((id>400)&&(id<500)){
		return 275-(((id-400)%10)*60);
	}
}

// id������y�ʒu���擾
function getYById(id){
	if(id<100){
		return (id%10)*64-32;
	}else if((id>200)&&(id<300)){
		return ((id-200)%10)*64-32;
	}else if((id>300)&&(id<400)){
		return (Math.floor((id-300)/10)*70)+348;
	}else if((id>400)&&(id<500)){
		return 228-(Math.floor((id-400)/10)*70);
	}
}

// ��̖��O����v���C���[�����擾
function getPlayerByKomaName(komaName){
	if(komaName.substr(0,1)=='-'){
		return komaName.substr(3,1)-0;
	}else{
		return komaName.substr(2,1)-0;
	}
}

// x,y,id,komaName����image�v�f���쐬
function createImageElement(x,y,id,komaName){
	var image = document.createElementNS('http://www.w3.org/2000/svg','image');
	image.setAttributeNS(null,'x',x);
	image.setAttributeNS(null,'y',y);
	image.setAttributeNS(null,'width',60);
	image.setAttributeNS(null,'height',64);
	image.setAttributeNS(null,'id',id);
	image.setAttributeNS('http://www.w3.org/1999/xlink','xlink:href',komaName+'.SVG');
	if(getPlayerByKomaName(komaName)==1){
		image.setAttribute('onclick','syougi('+id+')');
	}
	return image;
}

function createAnimateXElement(fromX,toX){
	var animate = document.createElementNS('http://www.w3.org/2000/svg','animate');
	animate.setAttributeNS(null,'attributeName','x');
	animate.setAttributeNS(null,'begin','indefinite');
	animate.setAttributeNS(null,'dur',2);
	animate.setAttributeNS(null,'from',fromX);
	animate.setAttributeNS(null,'to',toX);
	animate.setAttributeNS(null, 'repeatCount', 1);
	return(animate);
}

function createAnimateYElement(fromY,toY){
	var animate = document.createElementNS('http://www.w3.org/2000/svg','animate');
	animate.setAttributeNS(null,'attributeName','y');
	animate.setAttributeNS(null,'begin','indefinite');
	animate.setAttributeNS(null,'dur',2);
	animate.setAttributeNS(null,'from',fromY);
	animate.setAttributeNS(null,'to',toY);
	animate.setAttributeNS(null,'repeatCount',1);
	return (animate);
}

// svg�ɗv�f��ǉ�
function SVGappendChildByElement(element){
	var objBody = document.getElementsByTagName('svg').item(0);
	return objBody.appendChild(element);
}

// id�̈ʒu�ɋ���邩
function ifThereIsKoma(id){
	if(document.getElementById(id)){
		return true;
	}else{
		return false;
	}
}

function jsflagToLispflag(flag){
	if(flag==true){
		return 1;
	}else{
		return 0;
	}
}

// websocket���g�����b�Z�[�W�𑗐M
function sendMessage(type, from, to, komaFilename, naruflag) {
    if (!(komaFilename==null)) {
	var komaName = getKomaNameByFilename(komaFilename);
    } else {
	var komaName = 'aaa';
    }
    if(from>300){
	from=0;
    }
    if(komaName.substr(0,1)=='-'){
        komaName=komaName.substr(1,2);
    }
    var naru = jsflagToLispflag(naruflag);
    var theMessage = {
        'type':type,
        'to':to ,
	'from':from ,
	'name':komaName.substr(0,2),
	'prom':naru
    };
    theMessage = JSON.stringify(theMessage);
    console.log("send->" + theMessage);
    ws.send(theMessage);
//    if(ws.readyState==2){
//	console.log(3);
//    }
}



// �ڑ��t���O��true��
function setWSflag() {
    var wsflagElement = document.getElementById(2);
    wsflagElement.setAttribute('id', 3);
}

// ws�����
function closeWS() {
	if(ws)ws.close();
}

function resetTurnflag() {
	var turnflagElement = document.getElementById(1);
	turnflagElement.setAttribute('id', 0);
}
