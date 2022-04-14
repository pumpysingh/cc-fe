import Raven from 'raven-js';
const BingSpeech = require('./TextToSpeechService');

Messages.$inject = ['$rootScope', '$timeout', '$window', '$sce', '$localStorage', 'CallRequest', '$q'];
export default function Messages($rootScope, $timeout, $window, $sce, $localStorage, CallRequest, $q) {
    this.url = "";
    var ws = "";
    var sThis = this;
    $rootScope.conversation = true;
    var collection = [];
    var inerror = false;
    sThis.setwebSocketUrl = function (url) {
        this.url = url;
    };

    sThis.stopSocket = function () {
        ws.close();
    };

    sThis.triggerStopSocket = function () {
        inerror = true;
        ws.close();
    };

    this.startSocket = function () {
        var fThis = this;
        var inclose = false;
        inerror = false;
        ws = new WebSocket(this.url);

        ws.onopen = function(event){
            console.log("Connected!");
        };

        ws.onmessage = function (event) {
            var res;
            try {
                if (event.data && event.data != "") {
                    res = JSON.parse(event.data);
                    if ($window.scrollY < 905) {
                        $timeout(function () {
                            $('html, body').animate({
                                scrollTop: $("#chatbox").offset().top
                            }, 500);
                        }, 200);
                    }
                    $timeout(function () {
                        var element = $window.document.getElementById('textmessage');
                        if (element) {
                            element.focus();
                        }
                    }, 300);
                    if (res.activities) {
                        if (res.activities.length > 0) {
                            if (res.activities[0].from.id != "user1") {
                                $rootScope.watermark_value = res.watermark;
                                var message = { from: "me", class: "bubble me", "message": res.activities[0].text, showContinueBtn: false, inputHint: "expectingInput" };
                                var speak = {};

                                if (res.activities[0].speak) {
                                    speak.message = res.activities[0].speak;

                                }
                                else {
                                    speak.message = res.activities[0].text;
                                }
                                if (res.activities[0].channelData) {
                                    message.type = res.activities[0].channelData.type;
                                    message.showContinueBtn = res.activities[0].channelData.showbutton ? res.activities[0].channelData.showbutton : false;
                                }
                                if (res.activities[0].channelData) {
                                    message.type1 = res.activities[0].channelData.type1;
                                }

                                message.inputHint = res.activities[0].inputHint;
                                if (message.type === 'commentbox') {
                                    let element = $window.document.getElementById('textmessage');
                                    if (element) {
                                        element.value = '';
                                        element.disabled = true;
                                        element.style.cursor = 'default';
                                        element.removeAttribute("placeholder");
                                    }
                                    //disable mute, unmute, microphone & send message button
                                    let startVolumeBtn = $window.document.getElementById('startVolumeBtn');
                                    if (startVolumeBtn) {
                                        startVolumeBtn.style.pointerEvents = 'none';
                                        startVolumeBtn.style.cursor = 'default';
                                        startVolumeBtn.tabIndex = -1;
                                    }
                                    let stopVolumeBtn = $window.document.getElementById('stopVolumeBtn');
                                    if (stopVolumeBtn) {
                                        stopVolumeBtn.style.pointerEvents = 'none';
                                        stopVolumeBtn.style.cursor = 'default';
                                        stopVolumeBtn.tabIndex = -1;
                                    }
                                    let microPhoneBtn = $window.document.getElementById('microPhoneBtn');
                                    if (microPhoneBtn) {
                                        $(microPhoneBtn).attr('ng-class', "{ disabled: disabled }");
                                        microPhoneBtn.style.pointerEvents = 'none';
                                        microPhoneBtn.style.cursor = 'default';
                                        microPhoneBtn.tabIndex = -1;
                                    }
                                    let sendbtn = $window.document.getElementById('sendbtn');
                                    if (sendbtn) {
                                        sendbtn.style.pointerEvents = 'none';
                                        sendbtn.style.cursor = 'default';
                                        sendbtn.tabIndex = -1;
                                    }
                                }
                                if (message.type === 'endOfConversation') {
                                    $rootScope.conversation = false;
                                    $rootScope.endchat = true;
                                    if (message.showContinueBtn == false) {
                                        $rootScope.showFeedbackScreen();
                                    }
                                    let element = $window.document.getElementById('textmessage');
                                    if (element) {
                                        element.value = '';
                                        element.disabled = true;
                                        element.style.cursor = 'default';
                                        element.removeAttribute("placeholder");
                                    }
                                    //disable mute, unmute, microphone & send message button
                                    let startVolumeBtn = $window.document.getElementById('startVolumeBtn');
                                    if (startVolumeBtn) {
                                        startVolumeBtn.style.pointerEvents = 'none';
                                        startVolumeBtn.style.cursor = 'default';
                                        startVolumeBtn.tabIndex = -1;
                                    }
                                    let stopVolumeBtn = $window.document.getElementById('stopVolumeBtn');
                                    if (stopVolumeBtn) {
                                        stopVolumeBtn.style.pointerEvents = 'none';
                                        stopVolumeBtn.style.cursor = 'default';
                                        stopVolumeBtn.tabIndex = -1;
                                    }
                                    let microPhoneBtn = $window.document.getElementById('microPhoneBtn');
                                    if (microPhoneBtn) {
                                        $(microPhoneBtn).attr('ng-class', "{ disabled: disabled }");
                                        microPhoneBtn.style.pointerEvents = 'none';
                                        microPhoneBtn.style.cursor = 'default';
                                        microPhoneBtn.tabIndex = -1;
                                    }
                                    let sendbtn = $window.document.getElementById('sendbtn');
                                    if (sendbtn) {
                                        sendbtn.style.pointerEvents = 'none';
                                        sendbtn.style.cursor = 'default';
                                        sendbtn.tabIndex = -1;
                                    }
                                    setTimeout(function () {
                                        var btnElement = $window.document.getElementById('continueBtn');
                                        if (btnElement)
                                            btnElement.focus();
                                    }, 200);
                                }
                                else if (message.type === 'expectemail') {
                                    $rootScope.emailCheck = true;
                                }
                                else if (message.type === "clientId") {
                                    $rootScope.clientID = res.activities[0].channelData.clientId;
                                }
                                if (res.activities[0].customIntentName !== undefined && res.activities[0].customIntentName === "MarritialStatus" && message.type === "married") {
                                }

                                if (/\n/.test(speak.message)) {
                                    speak.message = speak.message.replace(new RegExp('\n', 'g'), '');
                                }
                                if (/\n/.test(message.message)) {
                                    message.message = message.message.replace(new RegExp('\n', 'g'), '<br>');
                                }
                                if (message.type1 === "wordunderline") {
                                    let text = res.activities[0].channelData.text;
                                    console.log("text", text);
                                    console.log("message.message ", message.message);
                                    message.message = message.message.replace(text, '<u>' + text + '</u>');
                                }
                                var linkMsg = false;
                                var linktoSend = '';
                                var displayNametoSend = '';
                                if (/\[/.test(message.message) && /\(/.test(message.message)) {
                                    let index = 0;
                                    linkMsg = true;
                                    while (index != -1) {
                                        let n1 = message.message.indexOf("[", index);
                                        let n2 = message.message.indexOf("]", n1);
                                        let n3 = message.message.indexOf("(", n2);
                                        let n4 = message.message.indexOf(")", n3);
                                        if (n1 != -1 && n2 != -1 && n3 != -1 && n4 != -1) {
                                            if (n1 < n2 && n2 < n3 && n3 < n4) {
                                                if (n3 == n2 + 1) {
                                                    let dispayname = message.message.slice(n1 + 1, n2);
                                                    let link = message.message.slice(n3 + 1, n4);
                                                    linktoSend = link;
                                                    displayNametoSend = dispayname;
                                                    let oldstringportion = message.message.slice(n1, n4 + 1);
                                                    var Sdispayname = message.message.slice(n1, n2 + 1);
                                                    var Slink = message.message.slice(n3, n4 + 1);
                                                    speak.message = speak.message.replace(Slink, '');
                                                    var newstringportion = '';
                                                    if (displayNametoSend == 'here') {
                                                        if (linktoSend == 'downloadtranscript') {
                                                            newstringportion = '<button style="color: #0a4587; text-decoration: underline; border: 0; background: none; padding: 0; outline: none;" onclick="angular.element(this).scope().download()" class="a-focus">' + dispayname + '</button>';
                                                            message.message = message.message.replace(oldstringportion, newstringportion);
                                                        }
                                                        else if (res.activities[0].channelData && res.activities[0].channelData.type == 'downloadpdf') {
                                                            var classname = link.replace(/^.*[\\\/]/, '');
                                                            classname = classname.replace(' ', '_');
                                                            classname = classname.replace('.', '_');
                                                            newstringportion = '<button style="color: #0a4587; text-decoration: underline; border: 0; background: none; padding: 0; outline: none;" onclick="angular.element(this).scope().DownloadPDF(\'' + link + '\')" class="a-focus ' + classname + '">' + dispayname + '</button>';
                                                            message.message = message.message.replace(oldstringportion, newstringportion);
                                                        }
                                                        else {
                                                            newstringportion = '<a style="color: #0a4587; text-decoration: underline;" href= "' + link + '" target=_blank class="a-focus">' + dispayname + '</a>';
                                                            message.message = message.message.replace(oldstringportion, newstringportion);
                                                        }
                                                    }
                                                    else {
                                                        if (res.activities[0].channelData && res.activities[0].channelData.type === "fsalink") {
                                                            newstringportion = '<a style="color: #0a4587; text-decoration: underline;" href= "' + link + '" onclick="FsaLinkClick()" target=_blank id="fsalinkclick" class="a-focus">' + dispayname + '</a>';
                                                            message.message = message.message.replace(oldstringportion, dispayname);
                                                            message.title = res.activities[0].channelData.type;
                                                            message.buttonUrl = link;
                                                        }
                                                        else {
                                                            newstringportion = '<a style="color: #0a4587; text-decoration: underline;" href= "' + link + '" target=_blank class="a-focus">' + dispayname + '</a>';
                                                            message.message = message.message.replace(oldstringportion, newstringportion);
                                                        }
                                                    }
                                                }
                                                else {
                                                    index = n2;
                                                }
                                            }
                                            else {
                                                index = n4;
                                            }
                                        }
                                        else {
                                            index = -1;
                                        }
                                    }
                                }
                                message.message = $sce.trustAsHtml(message.message);
                                if (res.activities[0].attachments) {
                                    if (res.activities[0].attachments[0].content.buttons) {
                                        console.log("all Buttons object ", res.activities[0].attachments[0].content.buttons);
                                        var buttons = res.activities[0].attachments[0].content.buttons;
                                        message.buttons = buttons;
                                        if (!linkMsg) {
                                            message.message = res.activities[0].text;
                                        } else { }
                                        console.log("Button message", message.buttons);
                                        for (var i = 0; i < message.buttons.length; i++) {
                                            var button = message.buttons[i];
                                            var buttonvalue = button.value;
                                            if (/\[/.test(buttonvalue) && /\(/.test(buttonvalue)) {
                                                let index = 0;
                                                while (index != -1) {
                                                    let n1 = buttonvalue.indexOf("[", index);
                                                    let n2 = buttonvalue.indexOf("]", n1);
                                                    let n3 = buttonvalue.indexOf("(", n2);
                                                    let n4 = buttonvalue.indexOf(")", n3);
                                                    if (n1 != -1 && n2 != -1 && n3 != -1 && n4 != -1) {
                                                        if (n1 < n2 && n2 < n3 && n3 < n4) {
                                                            if (n3 == n2 + 1) {
                                                                let dispayname = buttonvalue.slice(n1 + 1, n2);
                                                                let link = buttonvalue.slice(n3 + 1, n4);
                                                                let oldstringportion = button.value.slice(n1, n4 + 1);
                                                                button.linktoSend = link;
                                                                button.value = button.value.replace(oldstringportion, dispayname);
                                                                button.title = button.title.replace(oldstringportion, '<u>' + dispayname + '</u>');
                                                                button.title = '<span>' + button.title + '</span>';
                                                                index = n4;
                                                            }
                                                            else {
                                                                index = n2;
                                                            }
                                                        }
                                                        else {
                                                            index = n4;
                                                        }
                                                    }
                                                    else {
                                                        index = -1;
                                                    }
                                                }
                                            }
                                        }

                                        message.ctype = res.activities[0].attachments[0].contentType;
                                        console.log("Button Updated ", message.buttons);
                                    }
                                }

                                if (res.activities[0].channelData) {
                                    if (res.activities[0].channelData.type === "commentbox") {
                                        message.title = res.activities[0].channelData.type;
                                    }
                                    else if (res.activities[0].channelData.type === "video") {
                                        message.title = res.activities[0].channelData.type;
                                        message.linktoSend = linktoSend;
                                        message.imageurl = res.activities[0].channelData.data.imageurl;
                                    }
                                    else if (res.activities[0].channelData.type === "downloadtranscript") {
                                    }
                                    else if (res.activities[0].channelData.type === "clientId") {
                                        $rootScope.clientID = res.activities[0].channelData.clientId;
                                    }
                                    else if (res.activities[0].channelData.type === "showscreengrab") {
                                        message.title = res.activities[0].channelData.type;
                                        message.link = res.activities[0].channelData.link;
                                        message.link1 = res.activities[0].channelData.link1;
                                    }
                                    else if (res.activities[0].channelData.type === "buttonwithlink") {
                                        message.title = res.activities[0].channelData.type;
                                        message.link = res.activities[0].channelData.link;
                                        message.text = res.activities[0].channelData.Text;
                                    }
                                    else if (res.activities[0].channelData.type === "showcontinuebtn") {
                                        message.title = "showcontinuebtn";
                                    }
                                }


                                if ($rootScope.stat === 'Idle' && $rootScope.volume) {

                                    $rootScope.speakStart = true;
                                    $rootScope.$applyAsync();
                                    try {
                                        $rootScope.bingClientTTS.start_playing();
                                    }
                                    catch (e) {
                                        console.log("error in TTS stop playing ", e);
                                    }
                                    $rootScope.$applyAsync();
                                }

                                if (speak.message != undefined && $rootScope.volume) {
                                    $rootScope.$applyAsync();
                                    var speech = speak.message;
                                    $rootScope.speakStart = true;
                                    $rootScope.$applyAsync();
                                    try {
                                        $rootScope.bingClientTTS.synthesize(speech, BingSpeech.SupportedLocales.enUS_AriaNeural, function () {
                                            $rootScope.speakStart = true;
                                        });
                                    }
                                    catch (e) {
                                        console.log("error in TTS speak start ", e);
                                    }
                                }
                                $rootScope.messages.push(message);
                                if (res.activities[0] && res.activities[0].inputHint === "ignoringInput") {
                                    // if the input hint is ignore then show bubbles
                                }
                                else {
                                    $rootScope.botprocessing = false;
                                    $rootScope.focusInput = true;
                                }

                                if (message.type != "endOfConversation" && message.inputHint != "ignoringInput") {
                                    var chatNewMessage = document.getElementById('chatNewMessage');
                                    if (chatNewMessage) {
                                        try {
                                            chatNewMessage.play();
                                        }
                                        catch (err) {
                                            console.log("Audio play error occured.");
                                        }
                                    }
                                }
                            }
                        }
                    }
                    $timeout(function () {
                        var height = 0;

                        $('.message').each(function (i, value) {
                            height += parseInt($(this).height());
                        });
                        height += 1000;

                        $('.chatwindow').scrollTop(height);

                    }, 200, false);

                }
                else {
                    // console.log("Empty Data");
                }
            } catch (e) {
                console.log("exception while receiving the bot message ", e);
                $rootScope.botprocessing = false;

                // send exception to sentry analytics
                Raven.captureException(e);
                $rootScope.showAlert();
                SendErrorToGTM(e.name + ': ' + e.message);
            }
        };

        ws.onclose = function (event) {
            console.log(event.wasClean);
            console.log(event.code);
            console.log(event.reason);
            console.log("websocket Close ", event);
            var url = "StreamURL";
            inclose = true;
            console.log("Inerror ", inerror);

            if (!inerror) {
                var requestData = { "conversationID": $rootScope.conversationid, "watermark_value": $rootScope.watermark_value };

                if ($rootScope.conversation) {
                    CallRequest.sendRequest(requestData, url, "").then(function (data) {

                        if (data) {
                            $rootScope.conversationid = data.data.conversationId;
                            $rootScope.token = data.data.token;
                            $rootScope.$applyAsync();
                            var streamUrl = data.data.streamUrl;
                            sThis.setwebSocketUrl(streamUrl);
                            fThis.startSocket();
                        }
                    }, function (data) {
                        console.log("Web socket close get stream url failure " + data);
                    });
                }
            }
        };

        ws.onerror = function (event) {
            console.log(event.wasClean);
            console.log(event.code);
            console.log(event.reason);
            console.log("websocket Error ", event);
            var url = "StreamURL";
            inerror = true;
            if (!inclose) {
                var requestData = { "conversationID": $rootScope.conversationid, "watermark_value": $rootScope.watermark_value };
                CallRequest.sendRequest(requestData, url, "").then(function (data) {
                    if (data) {
                        $rootScope.token = data.data.token;
                        var streamUrl = data.data.streamUrl;
                        sThis.setwebSocketUrl(streamUrl);
                        fThis.startSocket();
                    }
                }, function (data) {
                    console.log("Web socket Error get stream url failure " + data);
                });
            }
        };
    };
}