var CryptoJS = require("crypto-js");
import 'file-saver';
import moment from 'moment';
import 'moment-timezone';
import Raven from 'raven-js';
const BingSpeech = require('./TextToSpeechService');
const sdk = require("microsoft-cognitiveservices-speech-sdk");

ChatBoardController.$inject = ['$scope', '$rootScope', '$state', 'config', 'localStorageService', 'CallRequest', '$timeout', 'Messages', 'DirectlineRequest', '$window', '$localStorage', '$filter', '$sce', '$interval', '$stateParams', 'speechService'];
export default function ChatBoardController($scope, $rootScope, $state, config, localStorageService, CallRequest, $timeout, Messages, DirectlineRequest, $window, $localStorage, $filter, $sce, $interval, $stateParams, speechService) {
    var previousStateSpeaker = false;

        var iPadcheck = false;
        var forlocalhostrun = "http://localhost";
        var baseUrl = window.location.protocol + '//' + window.location.host;
        var websiteOrigin = baseUrl;
        var parentUrl = document.referrer;
        if (parentUrl != null && parentUrl != undefined && parentUrl != "") {
            var parentDomain = parentUrl.match(/:\/\/(.[^/]+)/)[1];
            var pathArray = parentUrl.split('/');
            var protocol = pathArray[0];
            websiteOrigin = protocol + "//" + parentDomain;
        }

        if (window.addEventListener) {
            window.addEventListener('message', function (e) {
                if (e.origin === forlocalhostrun || e.origin === websiteOrigin) {
                    var task = e.data.task;
                    switch (task) { // postMessage tasks
                        case 'chatWidgetClick':
                            if (previousStateSpeaker) {
                                $scope.startVolume();
                            }
                            break;
                        //default:
                    }
                }
            }, false);
        }
        $scope.botName = config.Bot_Name;
        $scope.connecting = false;
        $scope.owlOptionsTestimonials = {
            autoPlay: 4000,
            stopOnHover: true,
            slideSpeed: 300,
            paginationSpeed: 600
        };

        $scope.fbAlbumImages = ["app/assets/images/slider-1.jpg", "app/assets/images/slider-2.jpg"];

        //for mobile home screen
        $rootScope.Mstart = true;
        $scope.mobileDevice = false;
        $rootScope.messages = [];
        if (DetectRTC.isMobileDevice === true) {
            iPadcheck = ((/iPad/i.test(navigator.userAgent || '')) || (/iPad/i.test(navigator.platform || '')) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
            if (iPadcheck) {
                $scope.mobileDevice = false;
            }
            else {
                $scope.mobileDevice = true;
                $scope.inprocess = true;
                $rootScope.isStart = true;
                $timeout(function () {
                    var element = $window.document.getElementById('h2');
                    if (element)
                        element.focus();
                }, 300);
            }

        } else {
            $scope.mobileDevice = false;
        }
        var throttleUserCount = 5000;
        $rootScope.checkThrottleUser = function () {
            var url = "GetThrottleCounter";
            CallRequest.getRequest(url, "").then(function (data) {
                if (data && data.data && data.data.counter < throttleUserCount) {
                    showChatWindow();
                }
                else {
                    hideChatWindow();
                }
            });
        };
        $rootScope.checkThrottleUser();
        //internet Disconnection 
        $scope.onlineReconnect = false;
        $scope.$watch('online', function (newStatus) {
            if (newStatus === false) {
                $scope.onlineReconnect = true;
            }
            else if (newStatus === true) {
                if ($scope.onlineReconnect) {
                    var url = "StreamURL";
                    var requestData = { "conversationID": $rootScope.conversationid, "watermark_value": $rootScope.watermark_value };
                    if ($rootScope.conversation) {
                        CallRequest.sendRequest(requestData, url, "").then(function (data) {
                            if (data) {
                                $rootScope.conversationid = data.data.conversationId;
                                $rootScope.token = data.data.token;
                                // $localStorage.convid = $rootScope.conversationid;
                                $rootScope.$applyAsync();
                                var streamUrl = data.data.streamUrl;
                                Messages.setwebSocketUrl(streamUrl);
                            }
                        },function(err){
                            Raven.captureMessage("Stream URl API Error "+err.status);
                        });
                    }
                }
            }
        });
        $rootScope.emailCheck = false;
        $scope.date = new Date();
        // $scope.fdate = $filter('date')($scope.date, 'MM/dd/yy');
        $scope.fdate = moment().tz('America/New_York').format('MM/DD/YY');
        $rootScope.speakStart = false;
        $rootScope.endchat = false;
        $rootScope.volume = false;
        $scope.chatStart = false;
        //for mannually close the socket
        $scope.disable = function () {
            Messages.stopSocket();
        };
        $scope.streamUrl = null;
        $rootScope.speakM = false;
        $rootScope.focusInput = true;
        $rootScope.botprocessing = false;
        $rootScope.message = "";
        if ($rootScope.messages.length > 0) {
            $scope.connecting = false;
        }
        else if (DetectRTC.isMobileDevice === true) {
            iPadcheck = ((/iPad/i.test(navigator.userAgent || '')) || (/iPad/i.test(navigator.platform || '')) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
            if (iPadcheck) {
            }
            else {
                $scope.connecting = false;
            }
        }
        $rootScope.screen = false;
        $scope.isFullscreen = false;
        $rootScope.clientID = '';
        $scope.speakKey = function () {
            $rootScope.speakM = false;
            $rootScope.$applyAsync();
        };
        var currentUserIPaddress = "";
        DetectRTC.DetectLocalIPAddress(function (ip) {
            if (ip) {
                currentUserIPaddress = ip;
            }
        });
        //start the conversation by clicking chat button
        $rootScope.startConversation = function () {
            $rootScope.clientID = '';
            $rootScope.messages = [];
            $rootScope.botprocessing = false;
            $rootScope.$applyAsync();
            if ($rootScope.messages.length == 0) {
                $scope.connecting = true;
            }
            $rootScope.Mstart = false;
            if (!$scope.chatStart) {
                $rootScope.widget = true;
                $rootScope.isStart = true;
                $rootScope.$applyAsync();
                $scope.inprocess = true;
                document.getElementById('textmessage').value = '';
                var url = "Conversation";
                $timeout(function () {
                    $('html, body').animate({
                        scrollTop: $("#chatbox").offset().top
                    }, 500);
                }, 200);
                $scope.inprocess = false;
                currentUserIPaddress = currentUserIPaddress.trim().replace("Public: ",'');
                var requestData = { websiteURL: window.parentUrl, userIP: currentUserIPaddress };
                CallRequest.sendRequest(requestData, url, "").then(function (data) {
                    if (data) {
                        $scope.connecting = false;
                        $rootScope.token = data.data.conversation.data.token;
                        $rootScope.conversationid = data.data.conversation.data.conversationId;
                        $localStorage.token = data.data.token;
                        $rootScope.speechToken = data.data.speechToken;
                        // Decrypt SpeechToken
                        var bytes  = CryptoJS.AES.decrypt(data.data.speechToken, data.data.conversation.data.conversationId);
                        var originalText = bytes.toString(CryptoJS.enc.Utf8);
                        try {
                            $rootScope.bingClientTTS = new BingSpeech.TTSClient(originalText);
                        }
                        catch (e) {
                            console.log("BingSpeech Client TTS issue ", $rootScope.isIE);
                        }
                        $scope.streamUrl = data.data.conversation.data.streamUrl;
                        Messages.setwebSocketUrl($scope.streamUrl);
                        Messages.startSocket();
                        var messagedatatosend = {};
                        var constantuuid = '50c9ec3c-4355-11eb-b378-0242ac130002';
                        var initiateMessage = constantuuid+"_//_";
                        if(currentUserIPaddress){
                            currentUserIPaddress = currentUserIPaddress.trim().replace("Public: ",'');
                            initiateMessage += currentUserIPaddress +"_//_" ;
                        }
                        
                        var currentWebsiteURL= window.parentUrl;
                        console.log("currentWebsiteURL ",currentWebsiteURL);
                        if(currentWebsiteURL){
                            initiateMessage += currentWebsiteURL.trim();
                        }
                        if (!$rootScope.psfl) {
                            messagedatatosend = {
                                'type': 'message',
                                'from': {
                                    'id': 'user1'
                                },
                                'text': initiateMessage
                            };
                        }
                        else {
                            messagedatatosend = {
                                'type': 'message',
                                'from': {
                                    'id': 'user1'
                                },
                                'text': initiateMessage
                            };
                        }
                        var messagedata = JSON.stringify(messagedatatosend);
                        var directlineURL = "https://directline.botframework.com/v3/directline/conversations/" + $rootScope.conversationid + "/activities";
                        var str = "Bearer " + $rootScope.token;
                        var header = { 'Authorization': str, 'Content-Type': ' application/json' };
                        $rootScope.botprocessing = true;
                        DirectlineRequest.sendRequest(messagedata, directlineURL, header).then(function (data) {
                            $scope.inprocess = false;
                        }, function (data) {
                            console.log("Failure of start conversation ", data);
                            Raven.captureException("Failure of start conversation ", data);
                            $scope.inprocess = false;
                            $rootScope.botprocessing = false;
                            SendErrorToGTM(JSON.stringify(data));
                        });
                        var reportRequestData = {
                            conversationid: data.data.conversation.data.conversationId,
                            channelId: 'directline'
                        };
                        var reporturl = 'Reporting/create';
                        CallRequest.sendRequest(reportRequestData, reporturl, "").then(function (redata) {
                            if (redata) {
                            }
                        });
                    }
                }).catch(function (error) {
                    $rootScope.showAlert();
                });
                $scope.chatStart = true;
                if (DetectRTC.isMobileDevice === true) {
                    var iPadcheck = ((/iPad/i.test(navigator.userAgent || '')) || (/iPad/i.test(navigator.platform || '')) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1));
                    if (iPadcheck) {
                        $timeout(function () {
                            var element = $window.document.getElementById('textmessage');
                            if (element) {
                                element.focus();
                            }
                        }, 300);
                    }
                    else {
                        $timeout(function () {
                            var element = $window.document.getElementById('h2');
                            if (element) {
                                element.focus();
                            }
                        }, 300);
                    }
                }
                else {
                    $timeout(function () {
                        var element = $window.document.getElementById('textmessage');
                        if (element) {
                            element.focus();
                        }
                    }, 300);
                }
                $scope.reconnect = function () {
                    var url = "tokenrefresh/" + $rootScope.token;
                    CallRequest.getRequest(url, "").then(function (data) {
                        if (data) {
                            $rootScope.token = data.data.token;
                        }
                    });
                };
                $interval(function () { $scope.reconnect(); }, 600000);
            }
            else {
                $timeout(function () {
                    $('html, body').animate({
                        scrollTop: $("#chatbox").offset().top
                    }, 500);
                }, 200);
                $timeout(function () {
                    var element = $window.document.getElementById('textmessage');
                    if (element) {
                        element.focus();
                    }
                }, 300);
            }
        };
        //message sending
        $scope.sendMessage = function (isCommentBox,notshowinchatbox) {
            if ($rootScope.speakStart && $rootScope.bingClientTTS) {
                try {
                    $rootScope.bingClientTTS.stop_playing();
                }
                catch (err) {
                    console.log("Exception ", err);
                }
                try {
                    $rootScope.bingClientTTS.start_playing();
                }
                catch (err) {
                    console.log("Exception ", err);
                }
            }
            if ($rootScope.Mstart) {
                $('#alertMessage').html("Please start chat.");
                $('#alertModal').modal('show');
            }
            if (!$scope.inprocess && !$rootScope.botprocessing && !$rootScope.endchat) {
                if (($rootScope.message && $rootScope.message != "") || isCommentBox == true) {
                    $scope.inprocess = true;
                    var sendmessage = $rootScope.message;
                    try {
                        if(!isCommentBox){
                            sendmessage = sendmessage.replace(/\.$/, "");
                        }
                    }
                    catch (err) {
                        console.log("Trim . issue in send Message ", err);
                        Raven.captureException("Trim . issue in send Message ", err);
                        SendErrorToGTM(err.name + ': ' + err.message);
                    }
                    $rootScope.message = "";
                    $rootScope.focusInput = false;
                    var messagedatatosend = {
                        'type': 'message',
                        'from': {
                            'id': 'user1'
                        },
                        'text': sendmessage
                    };
                    var messagedata = JSON.stringify(messagedatatosend);
                    if (sendmessage.length > 180) {
                        let sendmessage1 = sendmessage.slice(NaN, 90);
                        let sendmessage2 = sendmessage.slice(90, 180);
                        let sendmessage3 = sendmessage.slice(180, 270);
                        sendmessage = sendmessage1 + '<br>' + sendmessage2 + '<br>'+ sendmessage3;
                        sendmessage = $sce.trustAsHtml(sendmessage);
                    }
                    else if (sendmessage.length > 90) {
                        let sendmessage1 = sendmessage.slice(NaN, 90);
                        let sendmessage2 = sendmessage.slice(90, 120);
                        sendmessage = sendmessage1 + '<br>' + sendmessage2;
                        sendmessage = $sce.trustAsHtml(sendmessage);
                    }
                    var directlineURL = "https://directline.botframework.com/v3/directline/conversations/" + $rootScope.conversationid + "/activities";
                    var str = "Bearer " + $rootScope.token;
                    var header = { 'Authorization': str, 'Content-Type': ' application/json' };
                    DirectlineRequest.sendRequest(messagedata, directlineURL, header).then(function (data) {
                        if (data.data.id) {
                            $rootScope.focusInput = true;
                            $scope.inprocess = false;
                            if(!isCommentBox){
                                $rootScope.botprocessing = true;
                            }
                            if(notshowinchatbox){
                                $(".disable-btn").attr("disabled", true);
                                $(".disable-btn-a").off("click");
                            }
                            if(!isCommentBox && !notshowinchatbox){
                                $(".disable-btn").attr("disabled", true);
                                $(".disable-btn-a").off("click");
                                $rootScope.messages.push({ from: "you", class: "bubble1 you", message: sendmessage });
                                $timeout(function () {
                                    var height = 0;
                                    $('.message').each(function (i, value) {
                                        height += parseInt($(this).height());
                                    });
                                    height += 1000;
                                    $('.chatwindow').scrollTop(height);
                                }, 100, false);
                            }
                        }
                    }, function (data, status) {
                        console.log("Send Message Directline Response Status ", status);
                        if(data){
                            console.log("Send Message Directline Response data ", JSON.stringify(data));    
                        }
                        else{
                            console.log("Send Message Directline Response data ", data);
                        }
                        Raven.captureException("Message Send Failure ", data);
                        $rootScope.message = data.text;
                        $scope.inprocess = false;
                        SendErrorToGTM(JSON.stringify(data));
                    });
                } else {
                    console.log("Message is empty");
                }
                SendDataLayerOnAPICall($rootScope.clientID);
            }
            $timeout(function () {
                var element = $window.document.getElementById('textmessage');
                if (element) {
                    element.focus();
                }
            }, 300);
        };

        $scope.DownloadPDF = function (link) {
            var xhr = new XMLHttpRequest();
            xhr.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    const url = window.URL.createObjectURL(this.response);
                    const a = document.createElement("a");
                    a.href = url;
                    a.download = link.replace(/^.*[\\\/]/, '');
                    document.body.appendChild(a);
                    a.style.display = "none";
                    a.click();
                    a.remove();
                }
            };
            xhr.open('GET', link);
            xhr.responseType = 'blob';
            xhr.send();
        };

        //message sending on button click
        $scope.sendmessageOnButtonclick = function (message, button) {
            console.log("This Event ",button);
            if ($rootScope.speakStart && $rootScope.bingClientTTS) {
                try {
                    $rootScope.bingClientTTS.stop_playing();
                }
                catch (err) {
                    console.log("Exception ", err);
                }
                try {
                    $rootScope.bingClientTTS.start_playing();
                }
                catch (err) {
                    console.log("Exception ", err);
                }
            }
            if (!$rootScope.endchat) {
                message = message.replace('<span>','');
                message = message.replace('</span>','');
                message = message.replace('<u>','');
                message = message.replace('</u>','');
                $rootScope.message = message;
                if (message == 'Back') {
                    $scope.inprocess = false;
                    $rootScope.endchat = false;
                    $rootScope.botprocessing = false;
                }
                $scope.sendMessage(false);
                $timeout(function () {
                    var element = $window.document.getElementById('textmessage');
                    if (element) {
                        element.focus();
                    }
                }, 300);
            }
        };
        $scope.sendmessageOnSubmitclick = function (message) {
            if ($rootScope.speakStart && $rootScope.bingClientTTS) {
                try {
                    $rootScope.bingClientTTS.stop_playing();
                }
                catch (err) {
                    console.log("Exception ", err);
                }
                try {
                    $rootScope.bingClientTTS.start_playing();
                }
                catch (err) {
                    console.log("Exception ", err);
                }
            }
            var commentval = $('#' + message).val();
            if (commentval && commentval != "") {
                $rootScope.message = commentval;
                $('#' + message).attr('disabled', 'disabled');
                $('#commentboxsubmit').attr('disabled', 'disabled');
                $('#commentboxcancel').attr('disabled', 'disabled');
                $scope.sendMessage(true);
                $timeout(function () {
                    var element = $window.document.getElementById('textmessage');
                    if (element) {
                        element.focus();
                    }
                }, 300);
            }
        };
        $scope.ContinueNextMessage = function (message) {
            if ($rootScope.speakStart && $rootScope.bingClientTTS) {
                try {
                    $rootScope.bingClientTTS.stop_playing();
                }
                catch (err) {
                    console.log("Exception ", err);
                }
                try {
                    $rootScope.bingClientTTS.start_playing();
                }
                catch (err) {
                    console.log("Exception ", err);
                }
            }

            $rootScope.message = "Continue Chat";
            $scope.sendMessage(false,true);
            $timeout(function () {
                var element = $window.document.getElementById('textmessage');
                if (element) {
                    element.focus();
                }
            }, 300);
            
        };
        $scope.sendmessageOnCancelCommentclick = function (message) {
            if ($rootScope.speakStart && $rootScope.bingClientTTS) {
                try {
                    $rootScope.bingClientTTS.stop_playing();
                }
                catch (err) {
                    console.log("Exception ", err);
                }
                try {
                    $rootScope.bingClientTTS.start_playing();
                }
                catch (err) {
                    console.log("Exception ", err);
                }
            }
            var commentval = $('#' + message).val();
            $rootScope.message = "No feedback given";
            $('#' + message).attr('disabled', 'disabled');
            $('#commentboxcancel').attr('disabled', 'disabled');
            $('#commentboxsubmit').attr('disabled', 'disabled');
            $scope.sendMessage(true);
            $timeout(function () {
                var element = $window.document.getElementById('textmessage');
                if (element) {
                    element.focus();
                }
            }, 300);
        };
        //Speech to text
        var SpeechSDK;
        var recognizer;

        $scope.ismic = false;
        $scope.isIE = false;
        if(DetectRTC.browser.name.indexOf("IE") >= 0){
            $scope.isIE= true;
            console.log("IS IE ",$scope.isIE);
        }
        $scope.Initialize = function (onComplete) {
            if (!!window.SpeechSDK) {
                onComplete(window.SpeechSDK);
            }
        };
        //Start the Speech
        $scope.start = function () {
            if ($rootScope.Mstart) {
                $('#alertMessage').html("Please start chat.");
                $('#alertModal').modal('show');
            }
            else {
                if ($rootScope.speakStart && $rootScope.bingClientTTS) {
                    $rootScope.speakStart = false;
                    $rootScope.bingClientTTS.stop_playing();
                    $rootScope.bingClientTTS.start_playing();
                }
                $rootScope.speakM = true;
                $rootScope.$applyAsync();
                DetectRTC.load(function () {
                    if (DetectRTC.hasMicrophone === false) {
                        $('#alertMessage').html("Please plugin the Headphone");
                        $('#alertModal').modal('show');
                    }
                });
                $scope.btnClass = "chat-microbtn1";
                recognizer = speechService.Setup(sdk);
                speechService.RecognizerStart(sdk, recognizer);
            }
        };
        //SDK Function
        $scope.Initialize(function (speechSdk) {
            SpeechSDK = sdk;
        });

        //Microphone Enable/Disable
        $scope.$watch('stat', function (newval, oldval) {
            var micstart = false;
            if (newval == "Idle") {
                $scope.ismic = false;
                $scope.$applyAsync();
                micstart = document.getElementById("micstart");
                if (micstart) {
                    micstart.play();
                }
            }
            else if (newval == "Active") {
                $scope.ismic = true;
                $scope.$applyAsync();
                micstart = document.getElementById("micstart");
                if (micstart) {
                    micstart.play();
                }
            }
        });
        //start Volume
        $scope.startVolume = function () {
            if ($scope.chatStart) {
                previousStateSpeaker = false;
                $rootScope.volume = true;
                try {
                    $rootScope.bingClientTTS.start_playing();
                }
                catch (e) {
                    console.log("BingSpeech TTS error ", $rootScope.isIE);
                }
                var msgcontainer = document.getElementsByClassName('messagecontainer');
                if (msgcontainer) {
                    $(msgcontainer).removeAttr('role');
                }
                $timeout(function () {
                    var element = $window.document.getElementById('textmessage');
                    if (element) {
                        element.focus();
                    }
                }, 300);
            }
        };
        //stop Volume
        $scope.stopVolume = function () {
            if ($scope.chatStart) {
                previousStateSpeaker = true;
                $rootScope.volume = false;
                try {
                    $rootScope.bingClientTTS.stop_playing();
                }
                catch (e) {
                    console.log("Bing Speech TTS Stop Playing ", e);
                }

                var msgcontainer = document.getElementsByClassName('messagecontainer');
                if (msgcontainer) {
                    $(msgcontainer).attr('role', 'log');
                }
                $timeout(function () {
                    var element = $window.document.getElementById('textmessage');
                    if (element) {
                        element.focus();
                    }
                }, 300);
            }
        };
        //Chat Download
        $scope.download = function () {
            var convid = $rootScope.conversationid;
            var token = $localStorage.token;
            var url = "DownloadTranscript/" + convid;
            var header = {
                'Authorization': token,
                'Content-type': 'application/pdf',
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Expires': 'Sat, 01 Jan 2000 00:00:00 GMT'
            };
            console.log('chatscript');
            CallRequest.getRequest(url, header, "blob").then(function (data) {
                saveAs(data.data, 'chatscript.pdf');
            }).catch(function (error) {
                $rootScope.showAlert();
            });
            $timeout(function () {
                var element = $window.document.getElementById('textmessage');
                if (element)
                    element.focus();
            }, 300);

        };

        //View Full Screen
        $scope.chatFullScreen = function () {
            $rootScope.screen = true;

            $timeout(function () {
                var element = $window.document.getElementById('textmessage');
                if (element)
                    element.focus();
            }, 200);

            angular.element(document.querySelector(".chat_board_iframe_div")).css('width', '800px');
            angular.element(document.querySelector(".chat_board_iframe_div")).css('height', '800px');
            $scope.$applyAsync();
        };


        //Exit Full Screen
        $scope.exitfullScreen = function () {

            $rootScope.screen = false;

            $timeout(function () {
                var element = $window.document.getElementById('chatf');

                if (element)
                    element.focus();
            });

            $timeout(function () {
                var element = $window.document.getElementById('textmessage');
                if (element)
                    element.focus();
            }, 300);
        };

        //exit full screen on ESC click
        $(document).on('keyup keydown keypress', function (evt) {
            if (evt.keyCode === 27) {

                if ($rootScope.screen) {
                    $rootScope.screen = false;

                    $timeout(function () {
                        var element = $window.document.getElementById('chatf');

                        if (element)
                            element.focus();
                    }, 400);
                }
            }
        });

        //Exit fullscreen
        $scope.exitFscreen = function () {
            $rootScope.screen = false;

            $timeout(function () {
                var element = $window.document.getElementById('chatf');
                if (element)
                    element.focus();
            });

        };

        $scope.sessionEnded = false;
        $scope.endSession = function () {
            $scope.sessionEnded = true;
            if ($rootScope.volume) {
                try {
                    $rootScope.bingClientTTS.stop_playing();
                }
                catch (err) {
                    console.log("error in TTS stop playing ", err);
                }
            }
            $rootScope.endchat = false;
            $rootScope.conversation = true;
        };

        $scope.fullView = false;
        $scope.chatBotFullScreen = function () {
            $scope.fullView = true;
            $timeout(function () {
                var height = 0;

                $('.message').each(function (i, value) {
                    height += parseInt($(this).height());
                });
                height += 1000;

                $('.chatwindow').scrollTop(height);

            }, 300, false);
        };

        $scope.exitchatBotfullScreen = function () {
            $scope.fullView = false;
            $timeout(function () {
                var height = 0;

                $('.message').each(function (i, value) {
                    height += parseInt($(this).height());
                });
                height += 1000;

                $('.chatwindow').scrollTop(height);

            }, 200, false);
        };

        $scope.SendFeedback = function (val) {
            Messages.triggerStopSocket();
            $rootScope.botprocessing = false;
            previousStateSpeaker = true;
            $rootScope.volume = false;
            try {
                $rootScope.bingClientTTS.stop_playing();
            }
            catch (e) {
                console.log("Bing Speech TTS Stop Playing ", e);
            }
            var element = $window.document.getElementById('textmessage');
            if (element) {
                element.removeAttribute('disabled');
                element.style.removeProperty("cursor");
                element.placeholder = "Start Typing";
            }

            var muteElement = $window.document.getElementById('startVolumeBtn');
            if (muteElement) {
                muteElement.style.removeProperty("cursor");
                muteElement.style.removeProperty('pointer-events');
                muteElement.removeAttribute('tabindex');
            }
            var unmuteElement = $window.document.getElementById('stopVolumeBtn');
            if (unmuteElement) {
                unmuteElement.style.removeProperty("cursor");
                unmuteElement.style.removeProperty('pointer-events');
                unmuteElement.removeAttribute('tabindex');
            }
            var microBtnElement = $window.document.getElementById('microPhoneBtn');
            if (microBtnElement) {
                $(microBtnElement).removeAttr('ng-class');
                microBtnElement.style.removeProperty("cursor");
                microBtnElement.style.removeProperty('pointer-events');
                microBtnElement.removeAttribute('tabindex');
            }
            var sendBtnElement = $window.document.getElementById('sendbtn');
            if (sendBtnElement) {
                sendBtnElement.style.removeProperty("cursor");
                sendBtnElement.style.removeProperty('pointer-events');
                sendBtnElement.removeAttribute('tabindex');
            }

            $rootScope.checkThrottleUser();
            $scope.fullView = false;
            $scope.chatStart = false;
            $scope.sessionEnded = false;
            $rootScope.endchat = false;
            $rootScope.conversation = true;

            // for mobile view
            if ($scope.mobileDevice === true) {
                $scope.inprocess = true;
                $rootScope.isStart = true;
                $timeout(function () {
                    var element = $window.document.getElementById('h2');
                    if (element)
                        element.focus();
                }, 300);
            }
            else{
                $timeout(function () {
                    $rootScope.isStart = false;
                }, 300);
            }
            $rootScope.messages = [];
            $rootScope.$applyAsync();

            // call api to send feedback helpful or nothelpful
            var variables = [];
            var keys = [];
            var values = [];
            keys.push('userhelpfulfeedback');
            values.push(val);
            var objectkey = {
                key: keys[0],
                value: values[0]
            };
            variables.push(objectkey);
            var url = "Reporting/update";
            var requestData = {
                "conversationid": $rootScope.conversationid,
                "variables": variables
            };
            CallRequest.sendRequest(requestData, url, "").then(function (data) {
                if (data) {
                }
                else {
                    console.log("Error to send feedback");
                }
            }, function (res) {
                console.log("Error in send feedback ", res);
            });
            SendDataLayerOnAPICall($rootScope.clientID);
        };
        $scope.EndChatToRestart = function () {
            Messages.triggerStopSocket();
            $rootScope.botprocessing = false;
            previousStateSpeaker = true;
            $rootScope.volume = false;
            try {
                $rootScope.bingClientTTS.stop_playing();
            }
            catch (e) {
                console.log("Bing Speech TTS Stop Playing ", e);
            }
            var element = $window.document.getElementById('textmessage');
            if (element) {
                element.removeAttribute('disabled');
                element.style.removeProperty("cursor");
                element.placeholder = "Start Typing";
            }
    
            var muteElement = $window.document.getElementById('startVolumeBtn');
            if (muteElement) {
                muteElement.style.removeProperty("cursor");
                muteElement.style.removeProperty('pointer-events');
                muteElement.removeAttribute('tabindex');
            }
            var unmuteElement = $window.document.getElementById('stopVolumeBtn');
            if (unmuteElement) {
                unmuteElement.style.removeProperty("cursor");
                unmuteElement.style.removeProperty('pointer-events');
                unmuteElement.removeAttribute('tabindex');
            }
            var microBtnElement = $window.document.getElementById('microPhoneBtn');
            if (microBtnElement) {
                $(microBtnElement).removeAttr('ng-class');
                microBtnElement.style.removeProperty("cursor");
                microBtnElement.style.removeProperty('pointer-events');
                microBtnElement.removeAttribute('tabindex');
            }
            var sendBtnElement = $window.document.getElementById('sendbtn');
            if (sendBtnElement) {
                sendBtnElement.style.removeProperty("cursor");
                sendBtnElement.style.removeProperty('pointer-events');
                sendBtnElement.removeAttribute('tabindex');
            }
    
            $rootScope.checkThrottleUser();
            $scope.fullView = false;
            $scope.chatStart = false;
            $scope.sessionEnded = false;
            $rootScope.endchat = false;
            $rootScope.conversation = true;
    
            // for mobile view
            if ($scope.mobileDevice === true) {
                $scope.inprocess = true;
                $rootScope.isStart = true;
                $timeout(function () {
                    var element = $window.document.getElementById('h2');
                    if (element)
                        element.focus();
                }, 300);
            }
            else {
                $timeout(function () {
                    $rootScope.isStart = false;
                }, 300);
            }
            $rootScope.messages = [];
            $rootScope.$applyAsync();
        };
        
        $scope.closeMiniView = function () {
            if ($rootScope.volume) {
                $scope.stopVolume();
            }
        };
        $rootScope.showFeedbackScreen = function () {
            $scope.endSession();
        };
        $rootScope.showAlert = function (message) {
            if (!message) {
                message = "Something went wrong, please try after sometime!";
            }
            $('#alertMessage').html(message);
            $('#alertModal').modal('show');
        };

        var isIE = /*@cc_on!@*/false || !!document.documentMode;
        if (isIE) {
            $rootScope.isIE = isIE;
            var IEClassName = "ie-chat-btn";
            if (!document.getElementById('teaserBoxView').classList.contains(IEClassName)) {
                document.getElementById('teaserBoxView').classList.add(IEClassName);
            }
        }
        $rootScope.ShowScreenGrab = function (link) {
            ShowScreenGrab(link);
        };
}