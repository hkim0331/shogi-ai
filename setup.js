if((navigator.userAgent.indexOf('iPhone')>0||
    navigator.userAgent.indexOf('Android')>0||
    navigator.userAgent.indexOf('iPad')>0||
    navigator.userAgent.indexOf('iPod')>0)){
    document.write("<script xlink:href='syougi1sm.js'></script>");
    document.write("<script xlink:href='syougi2sm.js'></script>");
    document.write("<script xlink:href='syougi3sm.js'></script>");
    document.write("<script xlink:href='websocket.js'></script>");
    document.getElementById("nonedisp").setAttribute("style","display:none");
}else{
    document.write("<script xlink:href='syougi1.js'></script>");
    document.write("<script xlink:href='syougi2.js'></script>");
    document.write("<script xlink:href='syougi3.js'></script>");
    document.write("<script xlink:href='websocket.js'></script>");
    document.write("<script xlink:href='addlog.js'></script>");
}
