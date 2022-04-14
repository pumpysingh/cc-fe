import Raven from 'raven-js';
var CryptoJS = require("crypto-js");
speechService.$inject = ['$rootScope','$timeout','$window','$localStorage'];
export default function speechService($rootScope,$timeout,$window,$localStorage){

    var key, authorizationToken;
    var regionOptions;
    var languageOptions, formatOptions, inputSource, filePicker, microphoneSource;
    var recognizer;

    var reco;
    var speechConfig;
    var audioConfig;
    var lastRecognized = "";

    try {
        var AudioContext = window.AudioContext || window.webkitAudioContext || false;                          // could not find.

        if (AudioContext) {
            soundContext = new AudioContext();
        } else {
            console.log("Audio context not supported");
        }
    }
    catch (e) {
        window.console.log("no sound context found, no audio output. " + e);
        Raven.captureException(e);
        SendErrorToGTM(e.name + ': ' + e.message);
    }


    // Setup the recognizer
    this.RecognizerSetup = function (SpeechSDK, recognitionMode, languageOptions, formatOptions, key) {
        regionOptions = 'eastus';
        inputSource = "Mic";

        // Starts continuous speech recognition.
        

        // If an audio file was specified, use it. Else use the microphone.
        // Depending on browser security settings, the user may be prompted to allow microphone use. Using continuous recognition allows multiple
        // phrases to be recognized from a single use authorization.
        if (authorizationToken) {
            speechConfig = SpeechSDK.SpeechConfig.fromAuthorizationToken(authorizationToken, regionOptions);
        } else {
            if (key === "" || key === "YOUR_SPEECH_API_KEY") {
                alert("Please enter your Cognitive Services Speech subscription key!");
                return;
            }
            speechConfig = SpeechSDK.SpeechConfig.fromSubscription(key, regionOptions);
        }

        speechConfig.speechRecognitionLanguage = languageOptions;
        reco = new SpeechSDK.SpeechRecognizer(speechConfig, audioConfig);
        return reco;
    };


    this.UpdateStatus = function(status) {
        $rootScope.stat=status;
        $rootScope.$applyAsync();
    };

    // Start the recognition
    this.RecognizerStart = function (SpeechSDK, reco) {
        reco.recognizing = function (s, e) {
            $rootScope.stat="Listening_Recognizing";
            $rootScope.message = e.result.text;
            $rootScope.$applyAsync();
        };

        // The event recognized signals that a final recognition result is received.
        // This is the final event that a phrase has been recognized.
        // For continuous recognition, you will get one recognized event for each phrase recognized.
        reco.recognized = function (s, e) {
            $rootScope.stat="Idle";
            $rootScope.message = e.result.text;
            $rootScope.$applyAsync();
        };
        // The event signals that the service has stopped processing speech.
        // https://docs.microsoft.com/javascript/api/microsoft-cognitiveservices-speech-sdk/speechrecognitioncanceledeventargs?view=azure-node-latest
        // This can happen for two broad classes of reasons.
        // 1. An error is encountered.
        //    In this case the .errorDetails property will contain a textual representation of the error.
        // 2. No additional audio is available.
        //    Caused by the input stream being closed or reaching the end of an audio file.
        reco.canceled = function (s, e) {
            // statusDiv.innerHTML += "(cancel) Reason: " + SpeechSDK.CancellationReason[e.reason];
            if (e.reason === SpeechSDK.CancellationReason.Error) {
                console.log(e.errorDetails);
            }
        };

        // Signals that a new session has started with the speech service
        reco.sessionStarted = function (s, e) {
            $rootScope.stat="Active";
            $rootScope.$applyAsync();
        };

        // Signals the end of a session with the speech service.
        reco.sessionStopped = function (s, e) {
            $rootScope.stat="Idle";
            $rootScope.$applyAsync();
        };

        // Signals that the speech service has started to detect speech.
        reco.speechStartDetected = function (s, e) {
        };

        // Signals that the speech service has detected that speech has stopped.
        reco.speechEndDetected = function (s, e) {
        };
        

        // Starts recognition
        //reco.startContinuousRecognitionAsync();
         // Note: this is how you can process the result directly
        //       rather then subscribing to the recognized
        //       event
        // The continuation below shows how to get the same data from the final result as you'd get from the
        // events above.
        reco.recognizeOnceAsync(
            function (result) {
                switch (result.reason) {
                    case SpeechSDK.ResultReason.RecognizedSpeech:
                        break;
                    case SpeechSDK.ResultReason.NoMatch:
                        var noMatchDetail = SpeechSDK.NoMatchDetails.fromResult(result);
                        break;
                    case SpeechSDK.ResultReason.Canceled:
                        var cancelDetails = SpeechSDK.CancellationDetails.fromResult(result);
                        if (cancelDetails.reason === SpeechSDK.CancellationReason.Error) {
                            console.log(": " + cancelDetails.errorDetails);
                        }
                        break;
                }

                $rootScope.message= result.text;
                $rootScope.stat="Idle";
                $rootScope.$applyAsync();
            },
            function (err) {
                window.console.log(err);
                console.log("ERROR: " + err);
                $rootScope.stat="Idle";
                $rootScope.$applyAsync();
            });
    };

    // Stop the Recognition.
    this.RecognizerStop = function (SpeechSDK, recognizer) {
        recognizer.close();
        recognizer = undefined;
    };

    this.Setup = function (SpeechSDK) {
        if (recognizer != null && recognizer != undefined) {
            this.RecognizerStop(SpeechSDK, recognizer);
        }
        // Decrypt SpeechToken
        var bytes  = CryptoJS.AES.decrypt($rootScope.speechToken, $rootScope.conversationid);
        var originalText = bytes.toString(CryptoJS.enc.Utf8);
        recognizer = this.RecognizerSetup(SpeechSDK, "Interactive", "en-US", "Simple", originalText);
        return recognizer;
    };

    this.UpdateRecognizedHypothesis = function (text, append) {
        
        if (append){
            
            $rootScope.message += text + " ";
            if(/at/.test($rootScope.message) && /./.test($rootScope.message)){
                
                var at = $rootScope.message.indexOf('at');
                var remove= $rootScope.message.slice(at-1, at+3);
                $rootScope.message = $rootScope.message.replace(remove, '@');
                $rootScope.$applyAsync();
             }
            $rootScope.$applyAsync();
        }
        else{
            $rootScope.message = text;
            $rootScope.$applyAsync();
           if($rootScope.emailCheck){
                $timeout(function(){
                    if(/ at the rate/.test($rootScope.message) && /./.test($rootScope.message)){
                        $rootScope.message=$rootScope.message.replace(new RegExp(' at the rate', 'g'),'@');
                    }
                    else if(/ at /.test($rootScope.message) && /./.test($rootScope.message)){
                        
                        var at = $rootScope.message.indexOf('at');
                        var remove= $rootScope.message.slice(at-1, at+3);
                        $rootScope.message = $rootScope.message.replace(remove, '@');
                        $rootScope.$applyAsync();
                    }
                    
                },1000);

                $timeout(function() {
                    var element = $window.document.getElementById('textmessage');
                    if(element)
                    {
                        element.focus();
                    }    
                },1000); 
                
            }
            else{
                $rootScope.emailCheck = false;
                $timeout(function() {
                   var element = $window.document.getElementById('textmessage');
                    if(element)
                    {
                        element.focus();
                    }
                },1000); 
            }
        }
        var length = $rootScope.message.length;
        if (length > 403) {
            $rootScope.message = "..." + $rootScope.message.substr(length-400, length);
            $rootScope.$applyAsync();
        }
    };
}