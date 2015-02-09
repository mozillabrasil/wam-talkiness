angular.module('speaker', ['ionic', 'speaker.controllers', 'speaker.services'])

        .run(function ($ionicPlatform) {
            $ionicPlatform.ready(function () {
                window['$socket'] = io.connect('/');

                window['$socket'].on('connect', function () {
                    window['$socket'].emit('remote_connected');
                });
            });
        })

        .config(function ($stateProvider, $urlRouterProvider) {

            $stateProvider

                    .state('tab', {
                        url: "/tab",
                        abstract: true,
                        templateUrl: "templates/index.html"
                    })

                    .state('tab.control', {
                        url: '/control',
                        views: {
                            'tab-control': {
                                templateUrl: 'templates/tab-control.html',
                                controller: 'ControlCtrl'
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
                    })

                    .state('tab.camera', {
                        url: '/camera',
                        views: {
                            'tab-camera': {
                                templateUrl: 'templates/tab-camera.html',
                                controller: 'CameraCtrl'
                            }
                        }
                    })

                    .state('tab.configs', {
                        url: '/configs',
                        views: {
                            'tab-configs': {
                                templateUrl: 'templates/tab-configs.html',
                                controller: 'ConfigsCtrl'
                            }
                        }
                    });

            $urlRouterProvider.otherwise('/tab/control');

        });
