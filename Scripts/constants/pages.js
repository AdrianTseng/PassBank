/**
 * Created by LimeQM on 15-7-5.
 */

angular.module('PassBank').constant('PAGES', {
    home: {
        title: '',
        description: "由郑启明设计制作的免费非商业密码管理 WebApp 的首页，通过设置每个网站一个密码的密码使用习惯，避免由于社会工程学导致的信息泄漏",
        keywords: "WebApp,密码管理,在线,免费,非商业,首页"
    },
    user: {
        title: '账户管理',
        description: "由郑启明设计制作的免费非商业密码管理 WebApp 的用户管理界面，用来配置与管理用户的帐号信息",
        keywords: "WebApp,密码管理,在线,免费,非商业,帐号管理,账户管理"
    },
    keeper: {
        title: '密码银行',
        description: "由郑启明设计制作的免费非商业密码管理 WebApp 的密码银行，再次浏览用户托管的信息，需要登录后才能使用",
        keywords: "WebApp,密码管理,在线,免费,非商业,帐号管理,密码银行,密码托管,密码,加密"
    },
    preference: {
        title: '偏好设置',
        description: "由郑启明设计制作的免费非商业密码管理 WebApp 中密码银行的偏好设置页面，用来设置密码银行中的加密密码等信息",
        keywords: "WebApp,密码管理,在线,免费,非商业,帐号管理,密码银行,偏好设置,PIN,配置"
    },
    signup: {
        title: '服务注册',
        description: "由郑启明设计制作的免费非商业密码管理 WebApp 的用户登录页面",
        keywords: "WebApp,密码管理,在线,免费,非商业,帐号管理,注册,服务"
    }
});