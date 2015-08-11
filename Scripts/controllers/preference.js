/**
 * Created by LimeQM on 15-8-2.
 */

/**
 * Created by LimeQM on 15-7-3.
 */

angular.module('PassBank').controller('PreferenceController', ['$scope', '$resource', '$timeout', 'AuthorityService', 'IdentityService', 'API', 'EVENT', function ($scope, $resource, $timeout, AuthorityService, IdentityService, API, EVENT) {
    $scope.data = {
        pin: {
            current: null,
            update: null,
            verify: null
        },
        length: {
            value: null
        }
    };

    $scope.status = {
        authenticated: false,
        busy: false,
        keeper_activated: true
    };

    var Preference = $resource(API.preference);

    $scope.alerts = [];

    var set_success_info = function (msg) {
        $scope.alerts.push({type: 'success radius', msg: msg});
        $timeout(function () {
            $scope.alerts = $scope.alerts.filter(function (item) {
                return item.msg != msg;
            });
        }, 3500);

        $scope.status.busy = false;
    };

    var set_failure_info = function (msg) {
        $scope.alerts.push({type: 'danger radius', msg: msg});
        $timeout(function () {
            $scope.alerts = $scope.alerts.filter(function (item) {
                return item.msg != msg;
            });
        }, 4500);
        $scope.status.busy = false;
    };

    var user_reset = function (user) {
        $scope.data.length.value = user.keeper_length;
        $scope.status.authenticated = true;
        $scope.status.keeper_activated = user.keeper_active;
        Preference = $resource(API.preference, {token: IdentityService.get_token()});
    };

    $scope.$on(EVENT.unauthenticated, function () {$scope.status.authenticated = false;});

    $scope.$on(EVENT.authenticated, function () {
        IdentityService.get_user(function (user) {
            user_reset(user);
        }, function () {
            $scope.status.authenticated = false;
            $scope.$emit(EVENT.unauthenticated);
        });
    });

    if(!AuthorityService.is_authenticated()) {
        AuthorityService.authenticate();
    }else{
       IdentityService.get_user(function (user) {
           user_reset(user);
       }, function () {
           $scope.status.authenticated = false;
           $scope.$emit(EVENT.unauthenticated);
       });
    }

    $scope.update_pin = function (valid) {
        if(valid && !$scope.status.busy){
            $scope.status.busy = true;
            if(!$scope.status.keeper_activated) {
                Preference.get({target: 'keeper', item: 'pin', new_value: $scope.data.pin.update}).$promise.then(function () {
                    IdentityService.get_user(function (user) {
                        user.keeper_active = true;
                        $scope.status.keeper_activated = true;
                        IdentityService.set_user(user);
                    });
                    set_success_info("PIN码设置成功！您已经激活了密码银行服务");
                    IdentityService.get_user(function (user) {
                        var new_user = user;
                        new_user.keeper_activated = true;
                        IdentityService.set_user(new_user);
                    });
                }, function () {
                    set_failure_info("PIN码设置失败！");
                });
            }else{
                Preference.get({target: 'keeper', item: 'pin', new_value: $scope.data.pin.update, old_value: $scope.data.pin.current}).$promise.then(function () {
                    set_success_info("PIN码更新成功");
                }, function () {
                    set_failure_info("PIN码设置失败！");
                });
            }
        }
    };

    $scope.update_keeper_length = function (valid) {
        if(valid && !$scope.status.busy){
            $scope.status.busy = true;
            Preference.get({target: 'keeper', item: 'length', new_value: $scope.data.length.value}).$promise.then(function () {
                set_success_info("默认强密码长度更新成功");
            }, function () {
                set_failure_info("默认强密码长度更新失败");
            });
        }
    }

}]);