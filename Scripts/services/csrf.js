/**
 * Created by LimeQM on 15-7-5.
 */

angular.module('PassBank').factory('CSRF', ['$window', function ($window) {

    var get_csrf = function () {
        return $window.csrf_token;
    };

    return {
        get: get_csrf
    };
}]);