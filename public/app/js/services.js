angular.module('Swippl')

.service('swIdentitySvc', function() {
    var self = this;
    self.currentUser = null;
})

.service('swAuthSvc', function($rootScope, $http, swIdentitySvc) {
    var self = this;
    self.login = function(username, password) {
        return $http.post('/api/login', {
            username: username,
            password: password
        }).then(function(response) {
            console.log(response);
            if(response.data.result === "success") {
                swIdentitySvc.currentUser = response.data.user;
                $rootScope.$broadcast('logged-in');
                return true;
            } else {
                throw false;
            }
        });
    }
    self.logout = function() {
        swIdentitySvc.currentUser = null;
        $rootScope.$broadcast('logged-out');
    }
})

.service('swPhotoSvc', function($http, swIdentitySvc) {
    function getNextSet() {
        var path;
        if (swIdentitySvc.currentUser) {
            path = '/api/photos/set/user/' + swIdentitySvc.currentUser.UserID;
        } else {
            path = '/api/photos/set'
        }
        return $http.get(path).then(function(data) {
            return data;
        });
    }
    function getLiked(username) {
        return $http.get('/api/users/1/liked');
    }
    function getAll() {
        return $http.get('/api/photos/all');
    }
    return {
        getNextSet: getNextSet,
        getLiked: getLiked
    }
})

.service('swVoteSvc', function($http, $rootScope, swIdentitySvc) {
    var currentSession = [];
    var commitQueue = [];

    function addVote(thisVote) {

        currentSession.push(thisVote);

        if (swIdentitySvc.currentUser) {
            thisVote.UserID = swIdentitySvc.currentUser.UserID;
            return $http.post('/api/votes/add', thisVote);
        } else {
            commitQueue.push(thisVote);
        }
    }

    function commitVotes() {
        commitQueue.forEach(function(vote, index) {
            addVote(vote);
            console.log(vote);
            commitQueue.splice(index--, 1);
        });
    }

    function inCommitQueue(PhotoID) {
        console.log(commitQueue);
        for (var i = 0; i<commitQueue.length; i++) {
            if (commitQueue[i].PhotoID == PhotoID) return true;
        }
        return false;
    }

    $rootScope.$on('logged-in', commitVotes);

    return {
        addVote: addVote,
        inCommitQueue: inCommitQueue
    }
})

.service('swUserSvc', function($http, $q, swAuthSvc) {
    function signup(newUser) {
        return $http.post('/api/signup', newUser).then(function(res) {
            if (res.data.result == 'success') {
                return;
            } else {
                return $q.reject(res.data.message);
                // throws get caught by angular and reported, even in promises...
                //throw res.data.message;
            }
        });
    }

    return {
        signup: signup
    }
})

.value('myToastr', toastr)

.service('swToastSvc', function(myToastr) {
    myToastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "200",
        "hideDuration": "300",
        "timeOut": "5000",
        "extendedTimeOut": "1000",
        "showEasing": "swing",
        "hideEasing": "swing",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    return {
        success: function(msg) {
            myToastr.success(msg);
        },
        warn: function(msg) {
            myToastr.warning(msg);
        },
        error: function(msg) {
            myToastr.error(msg);
        }
    }
});