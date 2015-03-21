angular.module('public', ['ionic', 'public.controllers', 'public.services'])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                if (window.cordova && window.cordova.plugins.Keyboard) {
                    cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                }
                if (window.StatusBar) {
                    StatusBar.styleDefault();
                }
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {

            $stateProvider

                    .state('tab', {
                        url: "/tab",
                        abstract: true,
                        templateUrl: "templates/index.html"
                    })

                    .state('tab.ask', {
                        url: '/ask',
                        views: {
                            'tab-ask': {
                                templateUrl: 'templates/tab-ask.html',
                                controller: 'AskCtrl'
                            }
                        }
                    })

                    .state('tab.questions', {
                        url: '/questions',
                        views: {
                            'tab-questions': {
                                templateUrl: 'templates/tab-questions.html',
                                controller: 'QuestionsCtrl'
                            }
                        }
                    })
                    .state('tab.questions-detail', {
                        url: '/questions/:questionId',
                        views: {
                            'tab-questions': {
                                templateUrl: 'templates/tab-questions-detail.html',
                                controller: 'QuestionsDetailCtrl'
                            }
                        }
                    });

            $urlRouterProvider.otherwise('/tab/ask');

        });
