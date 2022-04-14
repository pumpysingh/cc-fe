routing.$inject = ['$stateProvider','$urlRouterProvider', '$locationProvider', '$compileProvider'];

export default function routing($stateProvider,$urlRouterProvider, $locationProvider, $compileProvider) {
    $stateProvider
            .state('chatWidget', {
                url: '/chatWidget',
                cache: false,
                views: {
                    'chat@': {
                        templateUrl: "app/assets/public/chatboard.html",
                        controller: 'ChatBoardController'
                    }
                },
                authenticate: false
            });
            $urlRouterProvider.otherwise('chatWidget');
            $locationProvider.hashPrefix('');
    $compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|blob|mailto|chrome-extension):/); 
}