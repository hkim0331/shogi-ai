function syougi3(num){
	if (ifAlreadyClicked() || (num == 999)) {
		removeCanMoveImage();
	} else if (! ifConectWsServer()) {
		alert("-No conection server(3sm).\n-Please wait...");
	} else if (! ifPlayer1Turn()) {
		alert("-Not your turn.\n-Please wait...");
	} else {
		var n=0,id=100,oou=0;
		var koma=document.getElementById(num).getAttribute('xlink:href');
		for(var i=11;i<100;i++){
			if((koma=='FU1.SVG')&&(document.getElementById(200+i))){
				oou=document.getElementById(200+i).getAttribute('xlink:href');
			}
			if(!(document.getElementById(i)||document.getElementById(200+i)||(i%10)==0||(((koma=='FU1.SVG')||(koma=='KY1.SVG'))&&(i%10)==1)||((koma=='KE1.SVG')&&((i%10)==1||(i%10)==2))||(koma=='FU1.SVG'&&(oou=='OU2.SVG')) )){
				createAndAppendImageElement(i, num, id);
				id++;
			}
		}
	}
}
