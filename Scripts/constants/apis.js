/**
 * Created by LimeQM on 15-7-7.
 */

angular.module('PassBank').constant('API', {
    user: '/api/v1/user/:token/:target',
    keeper: '/api/v1/keeper/:token/:pin/:id',
    permission: '/api/v1/permission/:access_key/:service',
    random: '/api/v1/random/:token/:length',
    preference: '/api/v1/preference/:token/:target/:item/:new_value/:old_value'
});