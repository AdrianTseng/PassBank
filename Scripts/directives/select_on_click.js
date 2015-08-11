/**
 * Created by 郑启明 on 15-7-16.
 */

angular.module('PassBank').directive('selectOnClick', function() {
    return {
        restrict: 'A',
        link: function (scope, element) {
            element.on('click', function () {
                this.select();
            });
        }
    }
});