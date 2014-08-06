angular.module('Swippl')

.controller('swMenuCtrl', function($scope, $location, swAuthSvc, swIdentitySvc, swUserSvc, swToastSvc) {

    $scope.logout = swAuthSvc.logout;
    $scope.toggleMenu = function() {
        $('.menuList').slideToggle('fast');
        $('.menuButton').toggleClass('active');
        $('.signupButton').removeClass('active');
        $('.loginButton').removeClass('active');
    };
    $scope.toggleLogin = function() {
        $('.loginList').slideToggle('fast');
        $('.loginButton').toggleClass('active');
        $('.signupButton').removeClass('active');
        $('.menuButton').removeClass('active');
        $('.signupList').slideUp('fast');
    };

    $scope.toggleSignup = function() {
        $('.signupList').slideToggle('fast');
        $('.loginButton').removeClass('active');
        $('.signupButton').toggleClass('active');
        $('.menuButton').removeClass('active');
        $('.loginList').slideUp('fast');
    };

    $scope.login = function() {
        swAuthSvc.login($scope.loginInfo.username, $scope.loginInfo.password).then(function() {
            swToastSvc.success('Welcome back, ' + $scope.loginInfo.username + '!');
            $scope.currentUser = swIdentitySvc.currentUser;
            $('.loginList').slideUp();
        }).catch(function(err) {
            swToastSvc.error('Login failed. Username or password is incorrect.');
        }).finally(function() {
            $scope.loginInfo.username = $scope.loginInfo.password = null;
        });
    };

    $scope.logout = function() {
        swAuthSvc.logout();
        $scope.currentUser = null;
        $('.menuList').slideUp();
        swToastSvc.success('Logged out!');
    };

    $scope.signup = function() {
        if(!$scope.newUser.Username || $scope.newUser.Username.length == 0) {
            return swToastSvc.warn('Please choose a username.');
        }
        if(!$scope.newUser.Password) {
            return swToastSvc.warn('Please choose a password.');
        }

        swUserSvc.signup($scope.newUser).then(function() {
            swToastSvc.success('New user created! Logging in...');
            return swAuthSvc.login($scope.newUser.Username, $scope.newUser.Password);
        }).then(function() {
            $scope.currentUser = swIdentitySvc.currentUser;
            swToastSvc.success('Logged in!');
            $('.signupList').slideUp();
        }).catch(function(err) {
            swToastSvc.error(err);
        }).finally(function() {
            $scope.newUser = null;
        });
    };

    if ($location.path() == '/login') {
        $scope.toggleLogin();
    }
})


.controller('swMainCtrl', function($scope) {
})