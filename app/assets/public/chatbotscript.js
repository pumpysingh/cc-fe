// check mobile device
window.mobileCheck = function () {
    var check = false;
    (function (a) { if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true; })(navigator.userAgent || navigator.vendor || window.opera);
    // updated for iPad view
    var isMobileDevice = !!(/Android|webOS|iPhone|iPod|BB10|BlackBerry|IEMobile|Opera Mini|Mobile|mobile/i.test(navigator.userAgent || ''));
    if (isMobileDevice) {
        if (isMobileDevice) {
            check = !((/iPad/i.test(navigator.userAgent || '')) || (/iPad/i.test(navigator.platform || '')) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
        }
    }
    return check;
};
var view = true;
var isMobile = mobileCheck();

(function (w, d, s, l, i) {
    w[l] = w[l] || []; w[l].push({
        'gtm.start':
            new Date().getTime(), event: 'gtm.js'
    });
    var a = d.getElementsByTagName('head')[0];
    var f = d.getElementsByTagName(s)[0],
        j = d.createElement(s), dl = l != 'dataLayer' ? '&l=' + l : '';
    j.async = true;
    j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl; f.parentNode.insertBefore(j, f);
    a.appendChild(j);
})(window, document, 'script', 'dataLayer', 'GTM-NZX9MKR');

var div_start = " chat_board_iframe_div_start";
var active_chat_view = " chatboard_view_active";
var active_teaser_view = " teaser_view_active";
if (/(iPhone|iPod|iPad)/i.test(navigator.userAgent)) {
    var isiPad = ((/iPad/i.test(navigator.userAgent || '')) || (/iPad/i.test(navigator.platform || '')) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    if (isiPad) {
        div_start = " ipad-scroll-position";
    }
    else {
        div_start = " chat_board_iframe_div_start_iphone";
    }
}
else{
    var isiPad = ((/iPad/i.test(navigator.userAgent || '')) || (/iPad/i.test(navigator.platform || '')) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
    if (isiPad) {
        div_start = " ipad-scroll-position";
    }
}
// where to send messages with postMessage
var target_origin = window.location.protocol + '//' + window.location.host;
var isChatStarted = false;
if (window.addEventListener) {
    // when DOM is ready assign button onclick handlers
    if (document.readyState !== 'loading') {
        // get reference to iframe window
        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        if (isIE) {
            var IEClassName = "ie-chat-btn";
            if (!document.getElementById('chat_widget_btn').classList.contains(IEClassName)) {
                document.getElementById('chat_widget_btn').classList.add(IEClassName);
            }
            var IETransitionClassName = "chat_board_iframe_div_start_ie11";
            if (!document.getElementById('chatDiv').classList.contains(IETransitionClassName)) {
                document.getElementById('chatDiv').classList.add(IETransitionClassName);
            }
        }
        if (isMobile) {
            view = false;
            document.getElementById('myChat').className += ' display_none';
        }
        else{
            document.getElementById('chat_widget_btn').setAttribute('aria-expanded', true);
        }
        var iframeUrl = document.getElementById('myChat') ? document.getElementById('myChat').src : '';
        if (iframeUrl != null && iframeUrl != undefined && iframeUrl != "") {
            var pathArray = iframeUrl.split('/');
            var protocol = pathArray[0];
            var parentDomain = pathArray[2];
            target_origin = protocol + "//" + parentDomain;
        }
        document.getElementById('chatIcon').addEventListener('click', function() {
            toggleView();
        });
        $('#myChat').on('load', function () {
            // send init to iframe - to initialize events
            var win = document.getElementById('myChat').contentWindow;
            win.postMessage({ 'task': 'init' }, target_origin);
            var data = {
                'event': 'chatEvent',
                'botCategory': 'chat',
                'botAction': 'impression'
            };
            dataLayer.push(data);
        });
        if (isMobile) {
        }
        $("#screengrabfullview").draggable({
            scroll: true,
            cursor: "move",
            start: function () {
                $('#screengrabfullview').css('transform', 'translate(0px, 0px)');
            },
            drag: function () {
            },
            stop: function () {
            }
        });
    } else {
        window.addEventListener('DOMContentLoaded', function () {
            var isIE = /*@cc_on!@*/false || !!document.documentMode;
            if (isIE) {
                var IEClassName = "ie-chat-btn";
                if (!document.getElementById('chat_widget_btn').classList.contains(IEClassName)) {
                    document.getElementById('chat_widget_btn').classList.add(IEClassName);
                }
                var IETransitionClassName = "chat_board_iframe_div_start_ie11";
                if (!document.getElementById('chatDiv').classList.contains(IETransitionClassName)) {
                    document.getElementById('chatDiv').classList.add(IETransitionClassName);
                }
            }
            if (isMobile) {
                view = false;
                document.getElementById('myChat').className += ' display_none';
            }
            else{
                document.getElementById('chat_widget_btn').setAttribute('aria-expanded', true);
            }
            var iframeUrl = document.getElementById('myChat') ? document.getElementById('myChat').src : '';
            if (iframeUrl != null && iframeUrl != undefined && iframeUrl != "") {
                var pathArray = iframeUrl.split('/');
                var protocol = pathArray[0];
                var parentDomain = pathArray[2];
                target_origin = protocol + "//" + parentDomain;
            }
            document.getElementById('chatIcon').addEventListener('click', function() {
                toggleView();
            });
            // get reference to iframe window
            $('#myChat').on('load', function () {
                var win = document.getElementById('myChat').contentWindow;
                // send init to iframe - to initialize events
                win.postMessage({ 'task': 'init' }, target_origin);
                var data = {
                    'event': 'chatEvent',
                    'botCategory': 'chat',
                    'botAction': 'impression'
                };
                dataLayer.push(data);
            });
            if (isMobile) {
            }
            $("#screengrabfullview").draggable({
                scroll: true,
                cursor: "move",
                start: function () {
                    $('#screengrabfullview').css('transform', 'translate(0px, 0px)');
                },
                drag: function () {
                },
                stop: function () {
                }
            });
        }, false);
    }
    // message handler
    window.addEventListener('message', function (e) {
        // check message origin
        if (e.origin === target_origin) {
            var task = e.data['task']; // task received in postMessage
            var data = {};
            switch (task) {  // postMessage tasks
                // on start click
                case 'start':
                    isChatStarted = true;
                    var existDivName = div_start.trim();
                    if (document.getElementById('chatBotView').classList.contains(existDivName)) {
                        document.getElementById('chatBotView').classList.remove(existDivName);
                    }
                    if (document.getElementById('chatDiv').classList.contains(existDivName)) {
                        document.getElementById('chatDiv').classList.remove(existDivName);
                    }
                    document.getElementById('chatBotView').className += div_start;
                    document.getElementById('chatDiv').className += div_start;
                    if (isMobile) {

                    }
                    else {
                        ShowChatHideTeaserView();
                    }
                    data = {
                        'event': 'chatEvent',
                        'botCategory': 'chat',
                        'botAction': 'fe_start'
                    };
                    dataLayer.push(data);
                    break;
                // on End Chat click from End chat screen
                case 'endchatendbutton':
                    data = {
                        'event': 'chatEvent',
                        'botCategory': 'chat',
                        'botLabel': 'end button'
                    };
                    dataLayer.push(data);
                    isChatStarted = false;
                    sendFeedback();
                    break;
                // on fullscreen click
                case 'fullScreenBtn':
                    document.getElementById('chatBotView').className += ' fullChatboard';
                    document.getElementById('chatDiv').className += ' fullviewHeight';
                    document.getElementById('chatIcon').className += ' display_none';
                    if (isMobile) {

                    }
                    else {
                        HideTeaserAndChatWindow();
                    }
                    data = {
                        'event': 'chatEvent',
                        'botCategory': 'chat',
                        'botAction': 'fullscreen'
                    };
                    dataLayer.push(data);
                    $("#screengrabfullview").removeAttr("style");
                    break;
                // on exit fullscreen click
                case 'exitfullScreenBtn':
                    document.getElementById('chatBotView').classList.remove("fullChatboard");
                    document.getElementById('chatDiv').classList.remove("fullviewHeight");
                    document.getElementById('chatIcon').classList.remove("display_none");
                    if (isMobile) {

                    }
                    else {
                        ShowChatHideTeaserView();
                    }
                    $("#screengrabfullview").removeAttr("style");
                    break;
                // to close teaser view
                case 'closeTeaser':
                    toggleView();
                    data = {
                        'event': 'chatEvent',
                        'botCategory': 'chat',
                        'botAction': 'close'
                    };
                    dataLayer.push(data);
                    break;
                // to close chat window
                case 'closeMiniView':
                    toggleView();
                    if ($('#chatIcon').hasClass("display_none")) {
                        document.getElementById('chatIcon').classList.remove("display_none");
                    }
                    data = {
                        'event': 'chatEvent',
                        'botCategory': 'chat',
                        'botAction': 'close'
                    };
                    dataLayer.push(data);
                    break;
                // to hide chat window for throttle user
                case 'hideChatBot':
                    hideChatWindow();
                    break;
                // to show chat window for throttle user
                case 'showChatBot':
                    showChatWindow();
                    break;
                case 'screengrabfullview':
                    var url = e.data['url'];
                    document.getElementById('screengrabfullview').classList.remove('display_none');
                    document.getElementById("ScreenGrabImg").src = url;
                    break;
                case 'startVolumeBtn':
                    data = {
                        'event': 'chatEvent',
                        'botCategory': 'chat',
                        'botAction': 'unmute'
                    };
                    dataLayer.push(data);
                    break;
                case 'stopVolumeBtn':
                    data = {
                        'event': 'chatEvent',
                        'botCategory': 'chat',
                        'botAction': 'mute'
                    };
                    dataLayer.push(data);
                    break;
                case 'microPhoneBtn':
                    data = {
                        'event': 'chatEvent',
                        'botCategory': 'chat',
                        'botAction': 'microphone'
                    };
                    dataLayer.push(data);
                    break;
                case 'saveTransript':
                    data = {
                        'event': 'chatEvent',
                        'botCategory': 'chat',
                        'botAction': 'save transcript'
                    };
                    dataLayer.push(data);
                    break;
                case 'endchatclick':
                    data = {
                        'event': 'chatEvent',
                        'botCategory': 'chat',
                        'botAction': 'end button'
                    };
                    dataLayer.push(data);
                    break;
                case 'OpenChatWidget':
                    data = {
                        'event': 'chatEvent',
                        'botCategory': 'chat',
                        'botAction': 'open'
                    };
                    dataLayer.push(data);
                    break;
                case 'fsalinkclick':
                    data = {
                        'event': 'userClickEvent',
                        'botCategory': 'Exit',
                        'botAction': 'FSA'
                    };
                    dataLayer.push(data);
                    break;
                case 'sendClientID':
                    data = {
                        'clientId': e.data['clientID']
                    };
                    dataLayer.push(data);
                    break;
            }
        }
    }, false);
}
function toggleView() {
    var isCloseClick = false;
    var win = document.getElementById('myChat').contentWindow;
    win.postMessage({ 'task': 'chatWidgetClick' }, target_origin);
    if ($('#myChat').hasClass("display_none")) {
        win.postMessage({ 'task': 'OpenChatWidget' }, target_origin);
        view = true;
        document.getElementById('chat_widget_btn').setAttribute('aria-expanded', true);
        if (isMobile) {

        }
        else {
            document.getElementById('myChat').classList.remove("display_none");
            ShowChatOrTeaserWindow();
        }
        $("#myChat").contents().find('#myChatStart').focus();
        $("#myChat").contents().find('#textmessage').focus();
    }
    else if (document.getElementById('myChat').style.display == "none") {
        win.postMessage({ 'task': 'OpenChatWidget' }, target_origin);
        document.getElementById('chat_widget_btn').setAttribute('aria-expanded', true);
        if (isMobile) {

        }
        else {
            document.getElementById("myChat").style.removeProperty("display");
            ShowChatOrTeaserWindow();
        }
        $("#myChat").contents().find('#myChatStart').focus();
        $("#myChat").contents().find('#textmessage').focus();
    }
    else {
        document.getElementById('chat_widget_btn').setAttribute('aria-expanded', false);
        document.getElementById('chat_widget_btn').focus();
        isCloseClick = true;
        view = false;
        if (isMobile) {

        }
        else {
            document.getElementById('myChat').className += ' display_none';
            HideChatOrTeaserWindow();
        }
    }
    if (isMobile) {
        if (view == true) {
            document.getElementById('chatIcon').className += ' display_none';
        }
        if (!isCloseClick && !isChatStarted) {
            win.postMessage({ 'task': 'triggermychatstartclick' }, target_origin);
        }
        var existDivName = div_start.trim();
        if (document.getElementById('chatBotView').classList.contains(existDivName)) {
            document.getElementById('chatBotView').classList.remove(existDivName);
        }
        if (document.getElementById('chatDiv').classList.contains(existDivName)) {
            document.getElementById('chatDiv').classList.remove(existDivName);
        }
        if ($('#myChat').hasClass("display_none") || document.getElementById('myChat').style.display == "none") {
            if (!document.getElementById('chatDiv').classList.contains(div_start.trim())) {
                document.getElementById('chatDiv').classList.add(div_start.trim());
            }
            if (!document.getElementById('chatBotView').classList.contains(div_start.trim())) {
                document.getElementById('chatBotView').classList.add(div_start.trim());
            }
        }
        else {
            if (document.getElementById('chatBotView').classList.contains(existDivName)) {
                document.getElementById('chatBotView').classList.remove(existDivName);
            }
            if (document.getElementById('chatDiv').classList.contains(existDivName)) {
                document.getElementById('chatDiv').classList.remove(existDivName);
            }
        }
        if (!isCloseClick) {
            if(!isChatStarted){
                setTimeout(function() {
                    if ($('#myChat').hasClass("display_none")) {
                        document.getElementById('myChat').classList.remove("display_none");
                    }
                    else if(document.getElementById('myChat').style.display == "none"){
                        document.getElementById("myChat").style.removeProperty("display");
                    } 
                }, 300);
            }
            else{
                if ($('#myChat').hasClass("display_none")) {
                    document.getElementById('myChat').classList.remove("display_none");
                }
                else if (document.getElementById('myChat').style.display == "none") {
                    document.getElementById("myChat").style.removeProperty("display");
                }
            }
        }
        else{
            document.getElementById('myChat').className += ' display_none';
        }
    }
}
function sendFeedback() {
    document.getElementById('myChat').style.display = 'none';
    document.getElementById('chatBotView').classList.remove("fullChatboard");
    document.getElementById('chatDiv').classList.remove("fullviewHeight");
    $('#chatBotView').removeClass(div_start);
    $('#chatDiv').removeClass(div_start);
    if (isMobile) {

    }
    else {
        HideTeaserAndChatWindow();
    }
    document.getElementById('chat_widget_btn').setAttribute('aria-expanded', false);
    if (!window.parent.document.getElementById('screengrabfullview').classList.contains('display_none')) {
        window.parent.document.getElementById('screengrabfullview').classList.add('display_none');
    }
}
function hideChatWindow() {
    if(!window.parent.document.getElementById('chatIcon').classList.contains("display_none")){
        window.parent.document.getElementById('chatIcon').classList.add("display_none");
    }
    if(!window.parent.document.getElementById('chatBotView').classList.contains("display_none")){
        window.parent.document.getElementById('chatBotView').classList.add("display_none");
    }
    if (window.parent.document.getElementById('chatDiv').classList.contains(active_teaser_view.trim())) {
        window.parent.document.getElementById('chatDiv').classList.remove(active_teaser_view.trim());
    }
}
function showChatWindow() {
    document.getElementById('chatBotView').style.display = '';
    document.getElementById('chatIcon').style.display = '';
    if(document.getElementById('chatIcon').classList.contains("display_none")){
        document.getElementById('chatIcon').classList.remove("display_none");
    }
    if(document.getElementById('chatBotView').classList.contains("display_none")){
        document.getElementById('chatBotView').classList.remove("display_none");
    }
    if (isMobile) {

    } else {
        if (!window.parent.document.getElementById('chatDiv').classList.contains(active_teaser_view.trim()) && !(window.parent.document.getElementById('myChat').classList.contains('display_none') || window.parent.document.getElementById('myChat').style.display == 'none')) {
            window.parent.document.getElementById('chatDiv').classList.add(active_teaser_view.trim());
        }
    }
}

function HideChatOrTeaserWindow() {
    if (document.getElementById('chatDiv').classList.contains('chat_board_iframe_div_start')) {
        // chatbox
        if (document.getElementById('chatDiv').classList.contains(active_chat_view.trim())) {
            document.getElementById('chatDiv').classList.remove(active_chat_view.trim());
        }
        if (window.parent.document.getElementById('chatDiv').classList.contains('fullviewHeight')) {
            window.parent.document.getElementById('chatDiv').classList.remove('fullviewHeight');
        }
        if (!window.parent.document.getElementById('screengrabfullview').classList.contains('display_none')) {
            window.parent.document.getElementById('screengrabfullview').classList.add('display_none');
        }
    }
    else if (document.getElementById('chatDiv').classList.contains('ipad-scroll-position')) {
        // //ipad view chatbox
        if (window.parent.document.getElementById('chatDiv').classList.contains(active_chat_view.trim())) {
            window.parent.document.getElementById('chatDiv').classList.remove(active_chat_view.trim());
        }
        if (window.parent.document.getElementById('chatDiv').classList.contains('fullviewHeight')) {
            window.parent.document.getElementById('chatDiv').classList.remove('fullviewHeight');
        }
        if (window.parent.document.getElementById('chatDiv').classList.contains('ipad-scroll-position')) {
            window.parent.document.getElementById('chatDiv').classList.remove('ipad-scroll-position');
        }
        if (!window.parent.document.getElementById('screengrabfullview').classList.contains('display_none')) {
            window.parent.document.getElementById('screengrabfullview').classList.add('display_none');
        }
    }
    else {
        // teaser box
        if (document.getElementById('chatDiv').classList.contains(active_teaser_view.trim())) {
            document.getElementById('chatDiv').classList.remove(active_teaser_view.trim());
        }
    }
}

function ShowChatOrTeaserWindow() {
    if ($('#chatBotView').hasClass("fullChatboard")) {
        document.getElementById('chatIcon').className += ' display_none';
    }
    if (document.getElementById('chatDiv').classList.contains('chat_board_iframe_div_start')) {
        // chatbox
        if (!document.getElementById('chatDiv').classList.contains(active_chat_view.trim())) {
            document.getElementById('chatDiv').classList.add(active_chat_view.trim());
        }
        if ($('#chatBotView').hasClass("fullChatboard")) {
            if (!window.parent.document.getElementById('chatDiv').classList.contains('fullviewHeight')) {
                window.parent.document.getElementById('chatDiv').classList.add('fullviewHeight');
            }
        }
    }
    else if (document.getElementById('chatBotView').classList.contains('ipad-scroll-position')) {
        // ipad view chatbox
        if ($('#chatBotView').hasClass("fullChatboard")) {
            if (!window.parent.document.getElementById('chatDiv').classList.contains('fullviewHeight')) {
                window.parent.document.getElementById('chatDiv').classList.add('fullviewHeight');
            }
        }
        else{
            if (!window.parent.document.getElementById('chatDiv').classList.contains(active_chat_view.trim())) {
                window.parent.document.getElementById('chatDiv').classList.add(active_chat_view.trim());
            }
        }
        if (!window.parent.document.getElementById('chatDiv').classList.contains('ipad-scroll-position')) {
            window.parent.document.getElementById('chatDiv').classList.add('ipad-scroll-position');
        }
    }
    else {
        // teaser box
        if (!document.getElementById('chatDiv').classList.contains(active_teaser_view.trim())) {
            document.getElementById('chatDiv').classList.add(active_teaser_view.trim());
        }
    }
}

function HideTeaserAndChatWindow() {
    if (document.getElementById('chatDiv').classList.contains(active_chat_view.trim())) {
        $('#chatDiv', window.parent.document).removeClass(active_chat_view.trim());
    }
    if (document.getElementById('chatDiv').classList.contains(active_teaser_view.trim())) {
        document.getElementById('chatDiv').classList.remove(active_teaser_view.trim());
    }
}

function ShowChatHideTeaserView() {
    if (!document.getElementById('chatDiv').classList.contains(active_chat_view.trim())) {
        $('#chatDiv', window.parent.document).addClass(active_chat_view);
    }
    if (document.getElementById('chatDiv').classList.contains(active_teaser_view.trim())) {
        document.getElementById('chatDiv').classList.remove(active_teaser_view.trim());
    }
}

function CloseScreenGrab(){
    $('#screengrabfullview').addClass('display_none');
    $("#screengrabfullview").removeAttr("style");
}