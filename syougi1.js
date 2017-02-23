document.onmouseup = reset;
document.onmousemove = move;
moveFlag = false;
moveId = 10000;
gamesetFlag=false;

function reset() {
    moveFlag = false;
    removeCanMoveImage();
    var target = document.getElementById(moveId);
    if (!(target == null)) {
    target.setAttribute('display', 'inline');
    target.setAttribute('x', getXById(moveId));
    target.setAttribute('y', getYById(moveId));
    }
}

function move() {
    if (moveFlag == true) {
        var svgPointObj = document.getElementsByTagName('svg').item(0).getBoundingClientRect();
    document.getElementById(moveId).setAttribute('x', event.x-30-svgPointObj.left);
    document.getElementById(moveId).setAttribute('y', event.y - 32-svgPointObj.top);
    }
}

function add(id) {
    document.getElementById(id).setAttribute('display', 'none');
    var target = document.elementFromPoint(event.x, event.y);
    if (target.getAttribute('xlink:href') == 'cango.SVG') {
    var x = parseInt(target.getAttribute('x'));
    var y = parseInt(target.getAttribute('y'));
    syougi2(getIdByXandY(x,y), id);
    }
}

// 動かす駒をクリックしてから移動できる場所を表示するまで
function syougi(id) {
    if(gamesetFlag==true){
        return;
    }
    if (id == 'undefined') {
    } else if (! ifConectWsServer()){
        alert("-No conection server(1).\n-Please wait...");
    } else if (ifPlayer2Turn()) {
        alert("-Not your turn.\n-Please wait...");
    } else {
        moveFlag = true;
        moveId = id;
        document.getElementById(id).setAttribute('onmouseup', 'add('+id+')');
        var koma = document.getElementById(id).getAttribute('xlink:href');
        var cangosvgId = 100;
        var opponentBaseId = 200;
        var x = getXById(id);
        var y = getYById(id);
        var nareruFlag = 0;
        var end = { upper: 31, lower: 545, left: 339, right: 821 };
        // 移動できる場所の表示
        switch (koma.toUpperCase()) {
        case 'FU1.SVG':
            var destinationId = id - 1;
            var destinationY = y - 64;
            if (! ifThereIsKoma(destinationId)) {
                if (end.upper < destinationY) {
                    createAndAppendImageElement(destinationId, id, cangosvgId);
                }
            }
            break;
        case 'KY1.SVG':
            var destinationX = x;
            var destinationId = 0;
            for (var destinationY = y - 64; destinationY > end.upper ; destinationY -= 64) {
                destinationId = getIdByXandY(destinationX, destinationY);
                var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
                if (breakFlag == 'break1') { break; }
                if (breakFlag == 'break2') { cangosvgId++; break; }
                cangosvgId++;
            }
            break;
    case 'KE1.SVG':
        var destinationX = [x - 60, x + 60];
        var destinationY = y - 128;
        var destinationId = [getIdByXandY(destinationX[0], destinationY), getIdByXandY(destinationX[1], destinationY)];
        if (destinationY > end.upper) {
        if (destinationX[0] > end.left) {
            if (! ifThereIsKoma(destinationId[0])) {
            createAndAppendImageElement(destinationId[0], id, cangosvgId);
            cangosvgId++;
            }
        }
        if (destinationX[1] < end.right) {
            if (!ifThereIsKoma(destinationId[1])) {
            createAndAppendImageElement(destinationId[1], id, cangosvgId);
            }
        }
        }
        break;

    case 'GI1.SVG':
        var around = { num: [0, 2, 3, 5, 7], id: [-11, -9, -1, 9, 11] };
        for (var i = 0; i < around.num.length; i++) {
        if (!ifDestinationIsEnd(id, end, around.num[i])) {
            var destinationId = getIdByXandY(x, y) + around.id[i];
            var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
            if (!(breakFlag == 'break1')) { cangosvgId++; }
        }
        }
        break;

    case 'KI1.SVG':
    case '-FU1.SVG':
    case '-KE1.SVG':
    case '-KY1.SVG':
    case '-GI1.SVG':
        var around = { num: [0,1, 3,4, 5, 6], id: [-11, -10, -1, 1,9,10] };
        for (var i = 0; i < around.num.length; i++) {
        if (!ifDestinationIsEnd(id, end, around.num[i])) {
            var destinationId = getIdByXandY(x, y) + around.id[i];
            var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
            if (!(breakFlag == 'break1')) { cangosvgId++; }
        }
        }
        break;

    case 'HI1.SVG':
        var destinationId = 0;
        for (var destinationX = x - 60; destinationX > end.left; destinationX -= 60) {
        destinationId = getIdByXandY(destinationX, y);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break;}
        cangosvgId++;
        }
        for (var destinationX = x + 60; destinationX < end.right; destinationX += 60) {
        destinationId = getIdByXandY(destinationX, y);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        for (var destinationY = y - 64; destinationY > end.upper; destinationY -= 64) {
        destinationId = getIdByXandY(x, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        for (var destinationY = y + 64; destinationY < end.lower; destinationY += 64) {
        destinationId = getIdByXandY(x, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        break;

    case '-HI1.SVG':
        var destinationId = 0;
        for (var destinationX = x - 60; destinationX > end.left; destinationX -= 60) {
        destinationId = getIdByXandY(destinationX, y);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        for (var destinationX = x + 60; destinationX < end.right; destinationX += 60) {
        destinationId = getIdByXandY(destinationX, y);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        for (var destinationY = y - 64; destinationY > end.upper; destinationY -= 64) {
        destinationId = getIdByXandY(x, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        for (var destinationY = y + 64; destinationY < end.lower; destinationY += 64) {
        destinationId = getIdByXandY(x, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        var around = { num: [0, 2, 5, 7], id:[-11,-9,9,11]};
        for (var i = 0; i < around.num.length; i++) {
        if (!ifDestinationIsEnd(id, end, around.num[i])) {
            var destinationId = getIdByXandY(x, y)+around.id[i];
            var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
            if (!(breakFlag == 'break1')) { cangosvgId++;}
        }
        }
        break;

    case 'KA1.SVG':
        var destinationId = 0;
        for (var destinationX = x - 60,destinationY=y-64; destinationX > end.left&&destinationY>end.upper; destinationX -= 60,destinationY-=64) {
        destinationId = getIdByXandY(destinationX, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        for (var destinationX = x + 60,destinationY=y-64; destinationX < end.right&&destinationY>end.upper; destinationX += 60,destinationY-=64) {
        destinationId = getIdByXandY(destinationX, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        for (var destinationX=x-60,destinationY = y + 64; destinationX>end.left&&destinationY < end.lower; destinationX-=60,destinationY += 64) {
        destinationId = getIdByXandY(destinationX, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        for (var destinationX=x+60,destinationY = y + 64; destinationX<end.right&&destinationY < end.lower; destinationX+=60,destinationY += 64) {
        destinationId = getIdByXandY(destinationX, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        break;

    case '-KA1.SVG':
        var destinationId = 0;
        for (var destinationX = x - 60, destinationY = y - 64; destinationX > end.left && destinationY > end.upper; destinationX -= 60, destinationY -= 64) {
        destinationId = getIdByXandY(destinationX, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        for (var destinationX = x + 60, destinationY = y - 64; destinationX < end.right && destinationY > end.upper; destinationX += 60, destinationY -= 64) {
        destinationId = getIdByXandY(destinationX, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        for (var destinationX = x - 60, destinationY = y + 64; destinationX > end.left && destinationY < end.lower; destinationX -= 60, destinationY += 64) {
        destinationId = getIdByXandY(destinationX, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        for (var destinationX = x + 60, destinationY = y + 64; destinationX < end.right && destinationY < end.lower; destinationX += 60, destinationY += 64) {
        destinationId = getIdByXandY(destinationX, destinationY);
        var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
        if (breakFlag == 'break1') { break; }
        if (breakFlag == 'break2') { cangosvgId++; break; }
        cangosvgId++;
        }
        var around = { num: [1, 3, 4, 6], id: [-10, -1, 1, 10] };
        for (var i = 0; i < around.num.length; i++) {
        if (!ifDestinationIsEnd(id, end, around.num[i])) {
            var destinationId = getIdByXandY(x, y) + around.id[i];
            var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
            if (!(breakFlag == 'break1')) { cangosvgId++; }
        }
        }
        break;

    case 'OU1.SVG':
        var around = { num: [0, 1,2, 3, 4, 5, 6,7], id: [-11, -10,-9, -1, 1, 9, 10,11] };
        for (var i = 0; i < around.num.length; i++) {
        if (!ifDestinationIsEnd(id, end, around.num[i])) {
            var destinationId = getIdByXandY(x, y) + around.id[i];
            var breakFlag = checkAndAppend(destinationId, id, cangosvgId);
            if (!(breakFlag == 'break1')) { cangosvgId++; }
        }
        }
        break;
    default: break;
    }

    }
    var target = document.getElementById(id);
    removeById(id);
    SVGappendChildByElement(target);
}

function ifDestinationIsEnd(num, end, i) {
    var x = getXById(num);
    var y = getYById(num);
    var destinationX = [x - 60, x + 60];
    var destinationY = [y - 64, y + 64];
    if (!(((i == 0 || i == 1||i==2) && (destinationX[1] > end.right)) || ((i == 0 || i == 3 || i == 5) && (destinationY[0] < end.upper)) || ((i == 5 || i == 7 || i == 6) && (destinationX[0] < end.left)) || ((i == 2 || i == 4 || i == 7) && (destinationY[1] > end.lower)))) {
    return false;
    }else{
    return true;
    }
}

// x,y,id,fileNameからimage要素を作成
function createImageElement(x, y, id, fileName) {
    var image = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    image.x = x;
    image.y = y;
    image.width = 60;
    image.height = 64;
    image.id = id;
    image.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', filename);
    return image;
}


// すでに他の駒がクリック済みか
function ifAlreadyClicked() {
    if (document.getElementById(100)) {
    return true;
    } else {
    return false;
    }
}

// 移動できる場所をリセット
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

//これも。下のコメント参照。
function ifPlayer2Turn() {
    //hkim debug
    //return false;
    //
    if (document.getElementById(1)) {
        return true;
    } else {
        return false;
    }
}

//FIXME: document.getElementById(3)がなんで ifConnectWsServer()なのかわからん。
//コネクトしたら id=3 の html オブジェクトがページに埋め込まれるってこと？
//スペルミスもある。return true, false も稚拙。
function ifConectWsServer() {
    //hkim debug
    //return true;
    //
    if (document.getElementById(3)) {
        return true;
    } else {
        return false;
    }
}

function createAndAppendImageElement(newId, oldId, imageId) {
    var image = createImageElement(getXById(newId), getYById(newId), imageId, 'cango');
    image.setAttribute('onmouseup', 'syougi2('+newId+',' + oldId + ')');
    SVGappendChildByElement(image);
}

function getIdByXandY(x, y) {
    return (((10 - ((x - 280) / 60)) * 10) + ((y + 32) / 64));
}

function checkAndAppend(destinationId, num, cangosvgId) {
    var opponentBaseId = 200;
    if (ifThereIsKoma(destinationId)) {
    return 'break1';
    } else if (ifThereIsKoma(destinationId + opponentBaseId)) {
    createAndAppendImageElement(destinationId, num, cangosvgId);
    return 'break2';
    } else {
    createAndAppendImageElement(destinationId, num, cangosvgId);
    }
}

// function checkHaveOu(player){
//     if(player == 1){
//         var idElement=document.getElementsByName('ou1').item(0);
//         if(idElement != null){
//             var id = document.getElementsByName('ou1').item(0).getAttribute('id')
//         }
//         if((id>100)||(id==null)){
//             alert('you lose');
//         }
//     }else{
//         var id = document.getElementsByName('ou2').item(0).getAttribute('id')
//         if((id>300)||(id==null)){
//             alert('you win');
//         }
//     }
// }

// id list
/*-----------------------------------

  -id-        -element-        -use to-

  0,1            board.svg        turn flag (0:player1's turn)
  2,3            komaoki1.svg    websocket flag (3:conect)
  11~99        koma1.svg        p1 place
  100,101...    cango.svg        can go
  211~299        koma2.svg        p2 place
  300,301...    koma1.svg        p1 motikoma
  400,401...    koma2.svg        p2 motikoma
  500~                        log

  ------------------------------------*/
