/**
 * Created by LimeQM on 15-7-15.
 */

angular.module('PassBank').directive('equals', function() {
    return {
        restrict: 'A', // only activate on element attribute
        require: 'ngModel',
        link: function(scope, elem, attrs, model) {
            if (!attrs.equals) {
                console.error('equals directive expects a model as an argument!');
                return;
            }
            // watch own value and re-validate on change
            scope.$watch(attrs.equals, function (value) {
                model.$setValidity('equals', value === model.$viewValue);
            });

            model.$parsers.push(function (value) {
                var isValid = value === scope.$eval(attrs.equals);
                model.$setValidity('equals', isValid);
                return isValid ? value : undefined;
            });
        }
    }
});