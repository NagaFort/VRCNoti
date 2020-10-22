if ('serviceWorker' in navigator) {
    // navigator.serviceWorker.register('/sw.js');
}

var inputUsername = $('#username');
var inputPassword = $('#password');

var btnConnect = $('#btnConnect');
var btnDisconnect = $('#btnDisconnect');

var listNotifications = $('#notifications');

var soundNotification = new Audio('./media/alert.mp3');

btnConnect.click(function () {
    var username = inputUsername.val();
    var password = inputPassword.val();
    vrcApi.logIn(username, password)
        .then(function (authorizated) {
            if (authorizated) {
                inputUsername.attr('readOnly', true);
                inputPassword.attr('readOnly', true);
                btnConnect.addClass('d-none');
                btnDisconnect.removeClass('d-none');
                vrcWS.init();
            }
        });
});

btnDisconnect.click(function () {
    vrcApi.logOut();
    vrcWS.close();
    inputUsername.removeAttr('readOnly', true);
    inputPassword.removeAttr('readOnly', true);
    btnConnect.removeClass('d-none');
    btnDisconnect.addClass('d-none');
});


function notificationTemplate(info) {
    var type = info.content.type;
    var senderUsername = info.content.senderUsername;
    var details = '';

    switch (type) {
        case 'invite':
            type = 'Invite';
            var worldName = info.content.details.worldName;
            details = `<p>${senderUsername}</p><p>${worldName}</p>`;
            break;
        case 'requestInvite':
            type = 'Request invite';
            details = `<p>${senderUsername}</p>`;
            break;
    }
    var template = `
    <li class="list-group-item">
        <div class="row">
            <div class="col-6 col-md-3 my-auto border-right">
                <span class="font-weight-bold">
                    ${type}
                </span>
            </div>
            <div class="col-12 col-md-6 order-2 order-md-1 mt-2 mt-md-0">
                ${details}
            </div>
            <div class="col-6 col-md-3 order-1 order-md-2 m-auto d-flex justify-content-around">
                <button type="button" class="btn btn-outline-primary btn-sm">
                    Action
                </button>
            </div>
        </div>
    </li>
    `;

    return template;
}

function webSocketMonitor(data) {
    var message = JSON.parse(data.data);
    message.content = JSON.parse(message.content);
    console.log(message);

    if (message.type === 'notification' && message.content.type !== 'friendRequest') {
        var notification = notificationTemplate(message);
        listNotifications.prepend(notification);
        soundNotification.play();
    }
}

vrcWS.monitor = webSocketMonitor;