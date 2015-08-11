/**
 * Created by LimeQM on 15-7-3.
 */

angular.module('PassBank').controller('UserController', ['$scope', '$resource', '$timeout', 'AuthorityService', 'IdentityService', 'API', 'EVENT', function ($scope, $resource, $timeout, AuthorityService, IdentityService, API, EVENT) {
    $scope.data = {
        username: "",
        email: "",
        password: "",
        password_new: "",
        password_verify: ""
    };

    $scope.state = {
        authenticated: false,
        username: "",
        busy: false,
        password_matched: true
    };

    $scope.alerts = [];

    var set_success_info = function (user, msg) {
        IdentityService.set_user(user);

        $scope.alerts.push({type: 'success radius', msg: msg});
        $timeout(function () {
            $scope.alerts = $scope.alerts.filter(function (item) {
                return item.msg != msg;
            });
        }, 3500);

        $scope.state.busy = false;
    };

    var set_failure_info = function (msg) {
        $scope.alerts.push({type: 'danger radius', msg: msg});
        $timeout(function () {
            $scope.alerts = $scope.alerts.filter(function (item) {
                return item.msg != msg;
            });
        }, 4500);
        $scope.state.busy = false;
    };

    var user_reset = function (user) {
        $scope.data.username = user.name;
        $scope.state.username = user.name;
        $scope.state.authenticated = true;
    };

    $scope.$on(EVENT.unauthenticated, function () {$scope.state.authenticated = false;});

    $scope.$on(EVENT.authenticated, function () {
        IdentityService.get_user(function (user) {
            user_reset(user);
        }, function () {
            $scope.state.authenticated = false;
            $scope.$emit(EVENT.unauthenticated);
        });
    });

    if(!AuthorityService.is_authenticated()) {
        AuthorityService.authenticate();
    }

    var User = $resource(API.user, {token: IdentityService.get_token()});

    $scope.update_username = function (valid) {
        if(valid && ($scope.state.username != $scope.data.username) && !$scope.state.busy) {
            $scope.state.busy = true;
            User.save({target: 'username'}, {data: $scope.data.username}).$promise.then(function (data) {
                user_reset(data.user);
                set_success_info(data.user, "更新用户名成功！");
            }, function () {
                set_failure_info("更新用户名失败");
            });
        }
    };

    $scope.update_email = function () {
        if (!$scope.state.busy){
            $scope.state.busy = true;
            User.save({target: 'email'}, {data: $scope.data.email}).$promise.then(function (data) {
                set_success_info(data.user, "更新用户邮箱成功");
            }, function () {
                set_failure_info("更新邮箱失败 ");
            });
        }
    };

    $scope.update_password = function (valid) {
        if(valid && !$scope.state.busy){
            $scope.state.busy = true;
            User.save({target: 'verify'}, {data: $scope.data.password}).$promise.then(function (data) {
                if(data.matched){
                    $scope.state.password_matched = true;
                    User.save({target: 'password'}, {data: $scope.data.password_new}).$promise.then(function (data) {
                        set_success_info(data.user, "更新用户密码成功");
                    }, function () {
                        set_failure_info("更新密码失败 ");
                    });
                }else{
                    set_failure_info("您的现在使用的密码校验失败，无法更新新密码");
                }
            }, function () {
                set_failure_info('验证密码失败，请检查网络连接');
            });
        }
    }

}]);