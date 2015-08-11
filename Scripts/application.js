/**
 * Created by 郑启明 on 15-7-1.
 */

angular.module('PassBank', ['ngRoute', 'ngResource', 'ngAnimate', 'mm.foundation'])
    .config(['$routeProvider', '$locationProvider', function($routeProvider, $locationProvider){
        $routeProvider.when('/home', {
            templateUrl: '/partials/home.html',
            controller: 'HomeController'
        }).when('/user', {
            templateUrl: '/partials/user.html',
            controller: 'UserController'
        }).when('/preference', {
            templateUrl: '/partials/preference.html',
            controller: 'PreferenceController'
        }).when('/keeper', {
            templateUrl: '/partials/keeper.html',
            controller: 'KeeperController'
        }).when('/signup', {
            templateUrl: '/partials/signup.html',
            controller: 'SignupController'
        }).otherwise({
            redirectTo: '/home'
        });

        $locationProvider.html5Mode(true).hashPrefix('!');
    }]).run(['$rootScope', '$location', 'EVENT', function ($rootScope, $location, EVENT) {
        $rootScope.$on('$routeChangeSuccess', function () {
            var path = $location.path().split('/')[1];
            $rootScope.$broadcast(EVENT.page_changed, path);
        });
    }]);