function syougi3(num) {
    if(gamesetFlag==true){return;}
    moveFlag = true;
    moveId = num;
    document.getElementById(num).setAttribute('onmouseup', 'add(' + num + ')');
    if (ifAlreadyClicked() || (num == 999)) {
        removeCanMoveImage();
    } else if (id == 'undefined') {
    } else if (! ifConectWsServer()) {
        alert("-No conection server(3).\n-Please wait...");
    } else if (ifPlayer2Turn()) {
        alert("-Not your turn.\n-Please wait...");
    } else {
        var n=0,id=100,oou=0;
        var koma = document.getElementById(num).getAttribute('xlink:href').toUpperCase();
        for(var i=11;i<100;i++){
            if((koma=='FU1.SVG')&&(document.getElementById(199+i))){
                oou=document.getElementById(199+i).getAttribute('xlink:href').toUpperCase();
            }
            if (!(document.getElementById(i) || document.getElementById(200 + i) || (i % 10) == 0 || (((koma == 'FU1.SVG') || (koma == 'KY1.SVG')) && (i % 10) == 1) || ((koma == 'KE1.SVG') && ((i % 10) == 1 || (i % 10) == 2)) || ((koma == 'FU1.SVG') && (oou == 'OU2.SVG') && (document.getElementById(199 + i))))) {
                createAndAppendImageElement(i, num, id);
                id++;
            }
        }
    }
    var target = document.getElementById(num);
    removeById(num);
    SVGappendChildByElement(target);
}
