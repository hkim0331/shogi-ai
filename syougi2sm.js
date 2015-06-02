function syougi2(newId, oldId) {

	// ����邩�ǂ��� ���鎞�͂Ȃ�����̋�� koma ��
	var koma = getKomaFilenameById(oldId).toUpperCase();
	var opponentBaseId = 200;
	var nareruLine = 224;
	var oldY = getYById(oldId);
	var x = getXById(newId);
	var y = getYById(newId);

	if (ifNareru(newId, oldId)) {
		if ((((koma == 'FU1.SVG') || (koma == 'KY1.SVG')) && (y <= 32)) || ((koma == 'KE1.SVG') && (y <= 96))) {
			var flg = true;
		} else {
			var flg = confirm('naru?');
		}
	}
	if (flg) {
		koma = '-' + koma;
	}

	sendMessage('move',oldId, newId, koma, flg);
	// ��̒ǉ�
	var image = createImageElement(x, y, newId, getKomaNameByFilename(koma));
	image.setAttribute('onclick', 'syougi(' + newId + ')');
	var objBody = document.getElementsByTagName('svg').item(0);
	objBody.appendChild(image);

	// �Ƃ�����̒ǉ��ƍ폜
	if (ifThereIsKoma(newId+opponentBaseId)) {
		var opponentKoma = document.getElementById(newId + opponentBaseId).getAttribute('xlink:href');
		opponentKoma = changeMotikomaNameByPlayer(opponentKoma, 1);
		var appendId = getEmptyMotikomaIdByPlayer(1);
		if (appendId % 10 > 4) { appendId += 6; }
		var appendX = getXById(appendId);
		var	appendY = getYById(appendId);
		var image = createImageElement(appendX, appendY, appendId, opponentKoma);
		image.setAttribute('onclick', 'syougi3(' + appendId+')');

		SVGappendChildByElement(image);
		removeById(newId + opponentBaseId);
	}
	// ���̋�̍폜
	removeById(oldId);
	// cango.svg �̍폜
	removeCanMoveImage();

	//setTurnFlg();
}

function setTurnFlg() {
	var tuenFlgElm = document.getElementById(0);
	setTurnFlg.setAttribute('id', 1)
}

function removeCanMoveImage() {
	for (var i = 1, x = 100; i <= 100; i++) {
		if (document.getElementById(x)) {
			var element = document.getElementById(x);
			var element_parent = element.parentNode;
			element_parent.removeChild(element);
			x = x + 1;
		} else {
			break;
		}
	}
}

function ifNareru(newId, oldId) {
	var koma = getKomaFilenameById(oldId).toUpperCase();
	var nareruLine = 224;
	var oldY = getYById(oldId);
	var newY = getYById(newId);
	if (!(oldId>300)&&((newY < nareruLine)||(oldY<nareruLine)) && (koma != 'KI1.SVG') && (koma != 'OU1.SVG') && (!ifAlreadyNatteru(koma))) {
		return true;
	} else {
		return false;
	}
}

function ifAlreadyNatteru(koma) {
	if (koma.substr(0, 1) == '-') {
		return true;
	} else {
		return false;
	}
}