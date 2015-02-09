angular.module('speaker.services', [])

        .factory('Questions_model', function ($http) {
            var Questions_model = {};

            Questions_model.all = function () {
                return $http.get('/questions/get');
            };

            Questions_model.get = function ($questionID) {
                return $http.get('/questions/get/'+$questionID);
            };

            return Questions_model;
        });