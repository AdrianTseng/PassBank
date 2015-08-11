/**
 * Created by LimeQM on 15-7-4.
 */

angular.module('PassBank').factory('SigninService',
    ['$modal', function ($modal) {


        var signin = function (success, failure) {
            var modalInstance = $modal.open({
                    templateUrl: '/user/signin',
                    controller: 'SigninController',
                    backdrop: false,
                    keyboard: false
                }
            );
            modalInstance.result.then((success || angular.noop), (failure|| angular.noop));
        };

        return {
            sign: signin
        };
}]);