/**
 * Created by LimeQM on 15-7-3.
 */

angular.module('PassBank').factory('IdentityService', ['$resource', '$window', 'identity', 'API', function ($resource, $window, identity, API) {
    var token = 'token';
    var user = 'user';
    var userAPI = $resource(API.user);

    var get_token = function () {
        if ($window.Storage){
            return $window.localStorage.getItem(token);
        }else {
            return identity.token;
        }
    };

    var set_token = function (value) {
        if ($window.Storage){
            $window.localStorage.setItem(token, value);
        }else{
            identity.token = value;
        }
    };

    var remove_token = function () {
        if ($window.Storage){
            $window.localStorage.removeItem(token);
        }else{
            identity.token = null;
        }
    };

    var get_user = function (success, failure) {
        if(identity.user !== null){
            (success || angular.noop)(identity.user);
        }else{
            var auth_token = get_token();
            if(auth_token === null){
                remove_user();
                (failure || angular.noop)();
            }else{
                userAPI.get({token: auth_token}).$promise.then(function (data) {
                    set_user(data.user);
                    (success || angular.noop)(data.user);
                }, function () {
                    remove_user();
                    remove_token();
                    (failure || angular.noop)();
                });
            }
        }
    };

    var set_user = function (user) {
        identity.user = user;
    };

    var remove_user = function () {
        identity.user = null;
    };

    return {
        set_token: set_token,
        get_token: get_token,
        remove_token: remove_token,
        set_user: set_user,
        get_user: get_user,
        remove_user: remove_user
    }
}]);