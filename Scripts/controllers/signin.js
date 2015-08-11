/**
 * Created by LimeQM on 15-7-4.
 */

angular.module('PassBank').controller('SigninController', ['$scope', '$http', '$location', '$modalInstance', 'CSRF', function ($scope, $http, $location, $modalInstance, CSRF) {
    $scope.signin_data = {
        email: "",
        password: ""
    };

    $scope.alerts = {
        invalid_user: false,
        server_error: false
    };

    $scope.status = {
        busy: false
    };

    var login_success = function (user_data) {
        $scope.alerts.invalid_user = false;
        $scope.alerts.server_error = false;
        $scope.status.busy = false;
        $modalInstance.close(user_data);
    };

    var login_failure = function () {
        $scope.alerts.invalid_user = true;
        $scope.alerts.server_error = false;
        $scope.status.busy = false;
    };

    var server_error = function () {
        $scope.alerts.server_error = true;
        $scope.alerts.invalid_user = false;
        $scope.status.busy = false;
    };

    $scope.user_signin = function (valid) {
        if (!$scope.status.busy && valid) {
            $scope.status.busy = true;
            $http.post('/user/signin', $scope.signin_data, {
                headers: {
                    'X-CSRFToken': CSRF.get()
                }
            }).success(function (data) {
                if (!data.success) {
                    login_failure();
                } else {
                    login_success(data)
                }
            }).error(function () {
                server_error();
            });
        }
    };

    $scope.cancel = function () {
        $modalInstance.dismiss();
    };

    $scope.to_signup = function () {
        $modalInstance.dismiss($location.path());
    };
}]);