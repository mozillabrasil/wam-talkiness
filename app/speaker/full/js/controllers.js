angular.module('speaker.controllers', ['ionic'])

        .controller('ControlCtrl', function ($scope) {
            
            $scope.menu = false;

            $scope.openMenu = function () {
                var $menu = document.getElementById('menu');
                var $menu_list = document.getElementById('menu-items');
                if( $scope.menu === true) {
                    classie.remove($menu, 'opened-nav');
                }else{
                    classie.add($menu, 'opened-nav');
                    $menu_list.style.top = ( ( ( $menu.offsetHeight - 250 ) / 2 ) - 5 ) + "px";
                }
                $scope.menu = !$scope.menu;
            };

            $scope.socketEmit = function ($direction) {
                if( $scope.menu === true ){
//                    $scope.openMenu();
                }
                window['$socket'].emit('remote', {
                    command: $direction
                });
            };
        })

        .controller('QuestionsCtrl', function ($scope, Questions_model) {

            $scope.questions = [];

            Questions_model.all().success(function ($questions) {
                $scope.questions = $questions;
            });

            $scope.doRefresh = function () {
                Questions_model.all().success(function ($questions) {
                    $scope.questions = $questions;
                }).finally(function () {
                    $scope.$broadcast('scroll.refreshComplete');
                });
            };
        })

        .controller('QuestionsDetailCtrl', function ($scope, $stateParams, Questions_model) {
            $scope.question = [];
            Questions_model.get($stateParams.questionId).success(function ($questions) {
                $scope.question = $questions[0];
            });
        })

        .controller('CameraCtrl', function ($scope) {
            var camera = document.getElementById("localVideo");
            var canvas = document.getElementById("canvas");
            var context = canvas.getContext("2d");
            var constraints = {"mandatory": {}, "optional": []};

            var getUserMedia = navigator.mozGetUserMedia.bind(navigator);
            try {
                getUserMedia({'audio': false, 'video': constraints}, function (stream) {
                    console.log("User has granted access to local media.");
                    camera.mozSrcObject = stream;
                    camera.play();
                    camera.style.opacity = 1;
                    streamStatus = true;
                }, function () {
                    alert('não rolou');
                });
                console.log("Requested access to local media with mediaConstraints:\n  \"" + JSON.stringify(constraints) + "\"");
            } catch (e) {
                alert("getUserMedia() failed. Is this a WebRTC capable browser?");
                console.log("getUserMedia failed with exception: " + e.message);
            }
            $scope.takePickture = function () {
                context.drawImage(camera, 0, 0);
                var dataURL = canvas.toDataURL('image/webp');
                window.open(dataURL);
            };

        })

        .controller('ConfigsCtrl', function ($scope) {
            $scope.settings = {
                enableFriends: true
            };
        });
