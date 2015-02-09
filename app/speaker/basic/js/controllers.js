angular.module('speaker.controllers', ['ionic'])

        .controller('ControlCtrl', function ($scope) {

            var socket = io.connect('/');
            var socketReady;

            socket.on('connect', function () {
                socket.emit('remote_connected');
                socketReady = true;
            });

            $scope.socketEmit = function ($direction) {
                socket.emit('remote', {
                    command: $direction
                });
            };
        });
