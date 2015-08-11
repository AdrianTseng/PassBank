/**
 * Created by LimeQM on 15-7-4.
 */

angular.module('PassBank').constant('EVENT', {
    unauthenticated: 'unauthenticated',
    authenticated: 'authenticated',
    authentication_failure: 'authentication_failure',
    unauthorized: 'unauthorized',
    authorized: 'authorized',

    page_changed: 'page_changed',
    to_signup: 'go_to_signup'
});