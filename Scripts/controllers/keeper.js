/**
 * Created by LimeQM on 15-7-6.
 */

angular.module('PassBank').controller('KeeperController', ['$scope', '$resource', '$tour', 'AuthorityService', 'EVENT', 'API', function ($scope, $resource, $tour, AuthorityService, EVENT, API) {
    var Passwords = $resource();

    var MODE = {
        BROWSER: {value: 0, partials: "/keeper/browser"},
        REVEAL: {value: 1, partials: "/keeper/edit"},
        EDIT: {value: 2, partials: "/keeper/edit"},
        CREATE: {value: 3, partials: "/keeper/edit"}
    };

    $scope.current = {
        authorized: false,
        authenticated: false,
        activated: true,
        opened: false,
        mode: MODE.BROWSER,
        selected: null,
        pin: null,
        pin_error: false,
        busy: false,
        edit: {}
    };

    $scope.passwords = [];

    $scope.$on(EVENT.unauthenticated, function () {$scope.current.authenticated = false;});

    $scope.$on(EVENT.authenticated, function () {
        $scope.current.authenticated = true;
        AuthorityService.user(function (user) {
            $scope.current.activated = user.keeper_active;
        });
    });

    $scope.$on(EVENT.unauthorized, function(){$scope.current.authorized = false;});

    $scope.$on(EVENT.authorized, function () {
        Passwords = $resource(API.keeper, {token:  AuthorityService.token(), pin: $scope.current.pin, id: '@id'}, {'update': {method: 'PUT'}});
        Passwords.query().$promise.then(function (data) {
            if(data.length === 0){
                $scope.create();
                $tour.start();
            }
            $scope.passwords = data.map(function (obj) {
                return angular.extend(obj, {isActive: false});
            });
        }, function () {
            $scope.passwords = [];
        });
        $scope.current.authorized = true;
    });

    if(!AuthorityService.is_authenticated()){
        AuthorityService.authenticate();
    }

    $scope.select = function(row) {
        if(row.isActive === false) {
            angular.forEach($scope.passwords, function (item) {
                item.isActive = item == row;
            });
        }else{
            $scope.current.selected = row;
            angular.copy($scope.current.selected, $scope.current.edit);
            $scope.current.mode = MODE.REVEAL;
        }
    };

    $scope.toBrowser = function(){
        angular.forEach($scope.passwords, function (item) {
            item.isActive = false;
        });
        $scope.current.mode = MODE.BROWSER;
        $scope.current.selected = null;
    };

    $scope.delete = function () {
        $scope.current.selected.$delete(function () {
            $scope.passwords = $scope.passwords.filter(function (item) {
                return item.state != "done";
            });
            $scope.toBrowser();
        });
    };

    $scope.create = function () {
        $scope.current.selected = angular.extend(new Passwords(), {isActive: false});
        angular.copy($scope.current.selected, $scope.current.edit);
        $scope.current.mode = MODE.CREATE;
    };

    $scope.submit = function (isValid) {
        if($scope.current.mode === MODE.REVEAL){
            $scope.current.edit.password = "";
            $scope.current.mode = MODE.EDIT;
        }else if($scope.current.mode == MODE.EDIT || $scope.current.mode == MODE.CREATE){
            if(isValid){
                $scope.current.selected.label = $scope.current.edit.label;
                $scope.current.selected.account = $scope.current.edit.account;
                $scope.current.selected.link = $scope.current.edit.link;
                if($scope.current.mode == MODE.EDIT && $scope.current.edit.password != ""){
                    $scope.current.selected.password_original = $scope.current.selected.password;
                    $scope.current.selected.password = $scope.current.edit.password;
                }else if ($scope.current.mode == MODE.CREATE){
                    $scope.current.selected.password = $scope.current.edit.password;
                }

                if($scope.current.mode == MODE.EDIT) {
                    $scope.current.selected.$update(function (data) {
                        $scope.current.selected = data;
                        $scope.toBrowser();
                    }, function (msg) {
                        alert(msg);
                    });
                }else{
                    $scope.current.selected.$save(function (data) {
                        $scope.passwords.push(data);
                        $scope.toBrowser();
                    }, function (msg) {
                        alert(msg);
                    });
                }
            }
        }
    };

    $scope.open = function () {
        if($scope.current.edit.link !== null && $scope.current.edit.link !== ""){
            window.open($scope.current.edit.link, "_blank");
        }
    };

    $scope.random = function () {
        var Random = $resource(API.random);
        Random.get({token:  AuthorityService.token(), length: 16}).$promise.then(function (data) {
            $scope.current.edit.password = data.random;
            $scope.current.temp = data.random;
        });
    };

    $scope.verify_pin = function (valid) {
        if(valid && !$scope.current.busy) {
            $scope.current.busy = true;
            var Preference = $resource(API.preference, {
                token: AuthorityService.token(),
                target: "verify",
                item: "pin"
            });
            Preference.get({new_value: $scope.current.pin}).$promise.then(function (result) {
                $scope.current.busy = false;
                if (result.valid) {
                    $scope.current.opened = true;
                    $scope.current.pin_error = false;
                    AuthorityService.is_authorized('keeper');
                }else{
                    $scope.current.opened = false;
                    $scope.current.pin_error = true;
                }
            }, function(){
                $scope.current.opened = false;
                $scope.current.pin_error = true;
            });
        }
    };
}]);