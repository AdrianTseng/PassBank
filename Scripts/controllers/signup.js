/**
 * Created by 郑启明 on 15-7-17.
 */


angular.module('PassBank').controller('SignupController', ['$scope', '$rootScope', '$http', '$location', 'IdentityService', 'AuthorityService', 'CSRF', 'EVENT', function ($scope, $rootScope, $http, $location, IdentityService, AuthorityService, CSRF, EVENT) {
    if(AuthorityService.is_authenticated()){
        $location.path('/home');
    }

    $scope.data = {
        email: "",
        password: "",
        username: ""
    };

    $scope.alerts = {
        invalid_email: false,
        server_error: false
    };

    $scope.status = {
        busy: false
    };
    
    var signup_success = function (user) {
        $scope.alerts.invalid_email = false;
        $scope.alerts.server_error = false;
        $scope.status.busy = false;
        IdentityService.set_token(user.token);
        IdentityService.set_user(user.user);
        $rootScope.$broadcast(EVENT.authenticated);
    };

    var signup_failure = function () {
        $scope.alerts.invalid_email = true;
        $scope.alerts.server_error = false;
        $scope.status.busy = false;
    };

    var server_error = function () {
        $scope.alerts.server_error = true;
        $scope.alerts.invalid_email = false;
        $scope.status.busy = false;
    };

    $scope.user_signup = function (valid) {
        if (!$scope.status.busy && valid) {
            $scope.status.busy = true;
            $http.post('/user/signup', $scope.data, {
                headers: {
                    'X-CSRFToken': CSRF.get()
                }
            }).success(function (data) {
                if (data.success) {
                    signup_success(data);
                } else {
                    signup_failure();
                }
            }).error(function () {
                server_error();
            })
        }
    };
}]);