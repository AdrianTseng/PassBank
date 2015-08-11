/**
 * Created by LimeQM on 15-7-5.
 */

angular.module('PassBank').controller('MainController', [
        '$scope',
        '$window',
        '$location',
        'AuthorityService',
        'EVENT',
        'PAGES',
        function ($scope, $window, $location, AuthorityService, EVENT, PAGES) {
            $scope.nav = {
                module: "",
                is_signed: false
            };

            $scope.page = PAGES.home;

            AuthorityService.is_authenticated();

            $scope.sign = function () {
                AuthorityService.authenticate();
            };

            $scope.withdraw = function () {
                AuthorityService.withdraw();
            };

            $scope.$on(EVENT.page_changed, function (event, data) {
                $scope.page = PAGES[data];
                $scope.nav.module = data;
                $window.ga('create', 'UA-65963654-1', 'auto');
                $window.ga('send', 'pageview');
            });

            $scope.$on(EVENT.authenticated, function () {
                $scope.nav.is_signed = true;
                if($location.path() == '/signup'){
                    var next = $location.search().next;
                    if(next === undefined || next == null) {
                        $location.path('/home');
                    }else{
                        $location.url('/' + next);
                    }
                }
            });

            $scope.$on(EVENT.authentication_failure, function () {
                $scope.nav.is_signed = false;
            });

            $scope.$on(EVENT.unauthenticated, function () {
                $scope.nav.is_signed = false;
            });

            $scope.$on(EVENT.to_signup, function (e, path) {
                $location.url('/signup?next=' + path.replace('/', ''));
            });
        }]
);