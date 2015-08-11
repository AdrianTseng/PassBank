/**
 * Created by LimeQM on 15-7-5.
 */

angular.module('PassBank').factory('AuthorityService', ['$rootScope', '$resource', 'IdentityService', 'SigninService', 'API', 'EVENT', function ($rootScope, $resource, IdentityService, SigninService, API, EVENT) {

    var is_authenticated = function () {
        var token = IdentityService.get_token();
        var authenticated = (token !== null) && (token !== undefined);
        if(authenticated){
            $rootScope.$broadcast(EVENT.authenticated);
        }else{
            $rootScope.$broadcast(EVENT.unauthenticated);
        }
        return authenticated;
    };

    var authenticate = function (success, failure) {
        var signin_success = function (data) {
            IdentityService.set_token(data.token);
            IdentityService.set_user(data.user);
            $rootScope.$broadcast(EVENT.authenticated, data.user);
            (success || angular.noop)();
        };

        var signin_failure = function (reason) {
            IdentityService.remove_token();
            IdentityService.remove_user();
            if(reason != null){
                $rootScope.$broadcast(EVENT.to_signup, reason);
            }else {
                $rootScope.$broadcast(EVENT.authentication_failure);
                (failure || angular.noop)();
            }
        };
        SigninService.sign(signin_success, signin_failure);
    };

    var withdraw = function (callback) {
        IdentityService.remove_token();
        IdentityService.remove_user();
        $rootScope.$broadcast(EVENT.unauthenticated);
        (callback || angular.noop)();
    };

    var is_authorized = function (service, success, failure) {
        var get_user_success = function (user) {
            var permission = $resource(API.permission);
            permission.get({access_key: user.access_key, service: service}).$promise.then(function (permit) {
                if(permit.approved){
                    $rootScope.$broadcast(EVENT.authorized);
                    (success || angular.noop)();
                }else{
                    $rootScope.$broadcast(EVENT.unauthorized);
                    (failure || angular.noop)();
                }
            });
        };

        var get_user_failure = function () {
            $rootScope.$broadcast(EVENT.unauthenticated);
            $rootScope.$broadcast(EVENT.unauthorized);
            (failure || angular.noop)();
        };
        IdentityService.get_user(get_user_success, get_user_failure);
    };

    var authority_verification = function (service, success, failure) {
        if (is_authenticated()){
            is_authorized(service, success, failure);
        }else{
            authenticate(function () {
                is_authorized(service, success, failure);
            }, failure);
        }
    };

    var get_token = function () {
        return IdentityService.get_token();
    };

    var get_user = function (success, failure) {
        return IdentityService.get_user(success, failure);
    };

    return {
        is_authenticated: is_authenticated,
        is_authorized: is_authorized,
        authenticate: authenticate,
        withdraw: withdraw,
        authority_verification: authority_verification,
        token: get_token,
        user: get_user
    };
}]);