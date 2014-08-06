angular.module('Swippl').config(function($routeProvider, $locationProvider) {
    $locationProvider.html5Mode(true);
    $routeProvider
        .when('/', {
            templateUrl: '/partials/main',
            controller: 'swMainCtrl'
        })
        .when('/login', {
            templateUrl: '/partials/main',
            controller: 'swMainCtrl'

        })
        .when('/signup', {
            templateUrl: '/partials/main',
            controller: 'swMainCtrl'
        })
        .when('/upload', {
            templateUrl: '/partials/upload',
            controller: 'swUploadCtrl'
        })
        .when('/profile', {
            templateUrl: '/partials/profile',
            controller: 'swProfileCtrl'
        })
        .when('/settings', {
            templateUrl: '/partials/settings',
            controller: 'swSettingsCtrl'
        })
        .when('/logout', {
            templateUrl: '/partials/settings',
            controller: 'swSettingsCtrl'
        })
})