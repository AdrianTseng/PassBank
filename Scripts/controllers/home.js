/**
 * Created by 郑启明 on 15-7-1.
 */

angular.module('PassBank').controller('HomeController', ['$scope', 'AuthorityService', function ($scope, AuthorityService) {
    AuthorityService.is_authenticated();
}]);
