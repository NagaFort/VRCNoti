var vrcWS = vrcWS || {};

(function(ws){

    ws.socket = '';
    ws.open = false;

    ws.init = function() {
        if(!vrcApi.authorizated) return false;

        var authCookie = vrcApi.userData.authCookie;

        ws.socket = new WebSocket('wss://pipeline.vrchat.cloud/?authToken='+authCookie);

        ws.socket.onopen = function() {
            ws.open = true;
            console.log('Web Socket conectado');
        };

        ws.socket.onclose = function() {
            ws.open = false;
            disconnect();
            if(ws.retryConnection) setTimeout(function() {
                btnConnect.click();
            }, 2000);
            console.log('Web Socket cerrado');
        };

        ws.socket.onmessage = ws.monitor || null;
        
    };

    ws.close = function() {
        if(!ws.open) return false;
        ws.open = false;
        ws.socket.close();
    };

})(vrcWS);