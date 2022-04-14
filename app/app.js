import 'jquery';
import angular from 'angular';
import uirouter from 'angular-ui-router';
import routing from './app.config';
import 'angular-local-storage';
import 'ng-onload';
import 'angular-sanitize';
import 'ngstorage';
import './assets/css/style.css';
import './assets/css/style-angular.css';
import './assets/css/custom.css';
import './assets/css/custom-responsive.css';
import './assets/css/chatboard.css';
import 'detectrtc';
import 'bootstrap';
import { constant } from './chat/config';
import CallRequest from './chat/apiservice';
import Messages from './chat/chat.directive';
import DirectlineRequest from './chat/directlineservice';
import ChatBoardController from './chat/chat.controller';
import speechService from './chat/speechToTextSpeechService';
import Raven from 'raven-js';
import 'regenerator-runtime/runtime';
var prestosolvoApp = angular.module('prestosolvoApp', [uirouter, 'LocalStorageModule', 'ngOnload', 'ngStorage', 'ngSanitize'])
.run(function ($rootScope, $state, $stateParams, $timeout, $window,$location) {
    if (location.href.indexOf("https://") == -1) {
        location.href = location.href.replace("http://", "https://");
    }
    $rootScope.psflTitle = "";
    $rootScope.psfl = false;
    if (location.href.indexOf("invite") == -1 || location.href.indexOf("type") == -1 || location.href.indexOf("source") == -1) { 
        $rootScope.psflTitle = "Incoming Loan Payment";
        $rootScope.psfl = false;
    }
    else{
        var getQueryString = function ( field, url ) {
            var href = url ? url : window.location.href;
            var reg = new RegExp( '[?&]' + field + '=([^&#]*)', 'i' );
            var string = reg.exec(href);
            return string ? string[1] : null;
        };
       var a = getQueryString('type', location.href);
        if (a == 'PSLF') {
            $rootScope.psflTitle = "PSLF Use Case";
            $rootScope.psfl = true;
            var fooState = {
                name: 'foo',
                url: 'home/:invite/:type/:source',
                params: {
                    refresh: { inherit: false }
                }
            };
            $state.go('fooState');
        }
        else {
            $rootScope.psflTitle = "Incoming Loan Payment";
            $rootScope.psfl = false;
        }
    }
    $rootScope.$on('$stateChangeStart',function(event, toState, toParams, fromState, fromParams) {
        if($rootScope.messages) {
            if ($rootScope.messages.length > 0) {
                if (!fromState) {
                    $rootScope.messages = [];
                } else {
                    $rootScope.isStart = true;
                    $timeout(function() {
                        var element = $window.document.getElementById('chatf');
                        var element2 = $window.document.getElementById('textmessage');
                        var objDiv = document.getElementById("style-4");
                        objDiv.scrollTop = objDiv.scrollHeight;

                        if(element && element2)
                        {
                            element.focus();
                            element2.focus();   
                        }
                    });

                }
            } else {
                $rootScope.isStart = false;
            }
        }else{
            $rootScope.messages=[];
        }
    });
    $rootScope.online = navigator.onLine;
    $window.addEventListener("offline", function () {
        $rootScope.$apply(function () {
            $rootScope.online = false;
        });
    }, false);

    $window.addEventListener("online", function () {
        $rootScope.$apply(function () {
            $rootScope.online = true;
        });
    }, false);

    Raven.config(constant.Sentry_URL,{
            ignoreErrors: [
                // Random plugins/extensions
                'top.GLOBALS',
                'Script error.',
                'Syntax error',
                "Object doesn't support property or method 'codePointAt'",
                'Unexpected reserved word',
                "Cannot read property 'statusText' of null",
                "null is not an object (evaluating 'y.statusText')",
                "Block-scoped declarations (let, const, function, class) not yet supported outside strict mode",
                "Web Socket Started",
                "Web socket Error has occured..",
                "Log Message - start chat click(handleStartChatClick - chatboardscript.js)",
                "NotAllowedError: The request is not allowed by the user agent or the platform in the current context, possibly because the user denied permission.",
                "Unexpected token ')'",
                "c.default is undefined",
                "e is undefined",
                "Unexpected use of reserved word 'class'",
                "?(chatbot/app/shared/speechToTextSpeechService)",
                "class is a reserved identifier",
                "undefined",
                "Identifier 'originalPrompt' has already been declared",
                "undefined is not an object (evaluating 'ceCurrentVideo.currentTime')",
                "Expected ')'",
                "Cannot set property 'data' of undefined",
                "undefined is not a function",
                "InvalidStateError",
                "Cannot read property 'reject' of null",
                "Cannot read property 'readyState' of null",
                "Out of memory",
                "Unterminated string constant",
                "Expected ']'",
                "Unable to get property 'telemetryDataEnabled' of undefined or null reference",
                "[BrotliDecompress] invalid distance",
                "Unable to get property '$$minErr' of undefined or null reference",
                "Expected '}'",
                "Unspecified error.",
                "Expected identifier"
            ]
        }).install();

}).constant('config', constant)
.config(routing)
.service('CallRequest', CallRequest)
.service('Messages', Messages)
.directive("owlCarousel", function () {
    return {
        restrict: 'E',
        transclude: false,
        link: function (scope) {
            scope.initCarousel = function (element) {
                // provide any default options you want
                var defaultOptions = {};
                var customOptions = scope.$eval($(element).attr('data-options'));
                // combine the two options objects
                for (var key in customOptions) {
                    defaultOptions[key] = customOptions[key];
                }
                // init carousel
                var curOwl = $(element).data('owlCarousel');
                if (!angular.isDefined(curOwl)) {
                    $(element).owlCarousel(defaultOptions);
                }
                scope.cnt++;
            };
        }
    };
}).directive('owlCarouselItem', [
    function () {
        return {
            restrict: 'A',
            transclude: false,
            link: function (scope, element) {
                // wait for the last item in the ng-repeat then call init
                if (scope.$last) {
                    scope.initCarousel(element.parent());
                }
            }
        };
    }
]).directive('ngEnter', function () {
    return function (scope, element, attrs) {
        element.bind("keydown keypress", function (event) {
            if (event.which === 13) {
                scope.$apply(function () {
                    scope.$eval(attrs.ngEnter);
                });
                event.preventDefault();
            }
        });
    };
}).directive('focusMe', function ($timeout) {
    return function (scope, element, attrs) {
        scope.$watch(attrs.focusMe, function (value) {
            if (value) {
                $timeout(function () {
                    element.focus();
                }, 200);
            }
        });
    };
}).service('DirectlineRequest', DirectlineRequest)
.service('speechService', speechService)
.controller("ChatBoardController", ['$scope', '$rootScope', '$state', 'config', 'localStorageService',
'CallRequest', '$timeout', 'Messages', 'DirectlineRequest', '$window', '$localStorage', '$filter',
'$sce', '$interval', '$stateParams', 'speechService',
ChatBoardController])
.filter('encodeURI', function () {
    return window.decodeURI;
});