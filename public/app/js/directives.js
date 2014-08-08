temp = [];

angular.module('Swippl')

.directive('swContainer', function($q, $rootScope, $document, $swipe, swPhotoSvc, swVoteSvc) {
    return function($scope, element, attrs) {

        // Variables
        {
            // Helper for inLastSet()
            var lastSet = [];

            // Helper variables for swipe
            var twistY = 0;
            var time = Date.now();
            var last;

            // Use an index to determine which photo to act on. Gets incremented
            // when a photo is in the process of being removed. Gets decremented
            // when the photo is removed thus, getBottom() should always return
            // the bottommost photo that is not being removed (animated out).
            var index = 1;
        }

        // Functions
        {
            /**
             * Check the stack to see if it is nearly empty. If so, get a new set
             * @return {void}
             */
            function checkList() {
                if ($(element).find('.swippl-slide').length <= 2) {
                    swPhotoSvc.getNextSet().then(handleImgs);
                }
            }

            /**
             * Prep image div.slide
             * @param {Object} photo            - Photo object used to create the slide
             * @param {Number} photo.PhotoID    - The UID of the photo from the database
             * @param {String} photo.Url        - A URL used as the src of the photo
             * @param {Number} photo.Score      - The current score of the photo (likes - dislikes)
             * @param {Number} photo.Prediction - The prediction for whether the user will like the photo (+ == like)
             * @param {Number} photo.SampleSize - The number of users used to calculate the prediction
             * @returns {IAugmentedJQuery}      - A div with the photo data embedded
             */
            function makeImg(photo) {
//                var img = angular.element('<div/>');
//                img.addClass('swippl-slide');
//                img.attr('data-photoid', photo.PhotoID);
//                img.attr('sw-photo', 'swipplData');
//                img.css({
//                    background: 'url("' + photo.ImgUrl + '") no-repeat center',
//                    'background-size': 'contain'
//                });

                var img = angular.element('<div/>');
                img.addClass('swippl-slide');
                img
                    .attr('data-photoid', photo.PhotoID)
                    .attr('data-score', photo.Score)
                    .attr('data-prediction', photo.Prediction)
                    .attr('data-samplesize', photo.SampleSize);
                //img.attr('sw-photo', 'swipplData');
                img.css({
                    background: 'url("' + photo.ImgUrl + '") no-repeat center',
                    'background-size': 'contain'
                });

                return img;
            }

            /**
             * Append image to the slide container.
             * @todo Determine if preloading is necessary.
             * @param imgElem {IAugmentedJQuery} - Image element created by the makeImg method
             * @param url {String} - The URL of the image, used to pre-load the image in an img tag and register a promise.
             * @returns {Deferred} - A promise that is resolved when the image is preloaded.
             */
            function appendImg(imgElem, url) {
                // Prepend the image to the stack
                element.prepend(imgElem);

                // Preload the image with an img tag
                var q = $q.defer();
                $('<img/>')
                    // When the image loads, resolve the promise to
                    // let handleImgs to move on to the next image
                    .load(function () {
                        q.resolve();
                    })
                    .attr('src', url);
                return q;
            }

            /**
             * Check to see if the last set sent by swPhotoSvc. Contains the photo in question, specified by PhotoID.
             * @param   PhotoID {Number} - The ID of the photo in question
             * @returns {boolean} - Whether or not the photo ID was in the last set sent by the swPhotoSvc.
             */
            function inLastSet(PhotoID) {
                for (var i = lastSet.length - 1; i >= 0; i--) {
                    if (lastSet[i] == PhotoID) return true;
                }
                return false;
            }

            // Take an array of images returned by the swPhotoService
            // and create divs for each and append them to the list
            function handleImgs(photos) {
                // Keep track of photos that are sent for this set so we
                // can reject them if they are sent in the next set.
                var thisSet = [];

                // Start w/ a pre-resolved promise to chain the creation
                // of each image off of. Each image is loaded when the
                // previous one has been created and appended.
                var q = $q.defer(true).promise;

                // Build stack of photos
                photos.data.reduce(function (memo, photo) {

                    // Add photo to the current set, to compare against the next set
                    thisSet.push(photo.PhotoID);

                    // If the photo is not in the last set, it is new, process it
                    // and add it to the stack
                    // if (!inLastSet(photo.PhotoID)) {
                    if (!inLastSet(photo.PhotoID)) { // Still not enough...
                         var currentPhoto = makeImg(photo);
                        return memo.then(appendImg(currentPhoto, photo.ImgUrl));
                    }

                    // Otherwise, ignore it, and continue with the next photo
                    return memo;
                }, q);

                // This set becomes the 'lastSet', which will be used when the next set is retrieved
                lastSet = thisSet;

                // Make the first image visible
                fadeIn(getBottom());
            }

            // Gets the bottommost image in the stack that is NOT in
            // the process of being removed. Relies on index to do so.
            // Takes an optional parameter to offset the index.
            function getBottom(i) {
                var offset = index + (i || 0);
                var photos = element.find('.swippl-slide');
                return photos[photos.length - offset];
            }

            function fadeIn(elem) {
                if (!elem) return;
                TweenLite.fromTo(elem,.5, {
                    scaleX: .67,
                    scaleY: .67,
                    opacity: 0
                }, {
                    scaleX: 1,
                    scaleY: 1,
                    opacity: 1,
                    force3D:true,
                    ease: Strong.easeInOut
                });
            }

            // Handles the key presses
            // Left (37) and right (39) are dislike and like, respectively
            // Up (38) is skip
            // TODO: Down (40) shows tags
            function keyPress(e) {

                if (e.originalEvent.srcElement.tagName == "INPUT") return;

                twistY = .5;
                if (e.which === 37) {
                    flipRemove(true, true);
                    e.stopPropagation();
                } else if (e.which === 39) {
                    flipRemove(false, true);
                    e.stopPropagation();
                } else if (e.which === 38) {
                    skipRemove(true);
                    e.stopPropagation();
                } else if (e.which === 40) {
                    // show tabs
                }
            }

            /**
             * Sends a vote to the swVoteSvc, pulling the data out of the imgElem, if available.
             * @param imgElem {!HTMLDivElement} - The photo that is to be voted on.
             * @param vote {!Number} - A number representing the vote (-1 == dislike, 0 == skip, 1 == like)
             */
            function sendVote(imgElem, vote) {
                var $imgElem = $(imgElem);
                var thisVote = {
                    PhotoID: $imgElem.attr('data-photoid'),
                    Vote: vote,
                    Score: $imgElem.attr('data-score'),
                    SampleSize: $imgElem.attr('data-samplesize'),
                    Prediction: $imgElem.attr('data-prediction'),
                };

                swVoteSvc.addVote(thisVote)
                    .then(console.log.bind(console))
                    .catch(console.warn.bind(console));
            }

            // Removes the bottommost image from the stack that is not already
            // being removed. Animates in the direction of the drag/key press,
            // and registers a vote through the swVoteSvc.
            //
            // Increments and decrements index to indicate the image is in the
            // process of removal.
            //
            // A call to checkList() ensures that a new set is requested, if
            // the removal makes the current stack fewer than checkList's limit.
            function flipRemove(left, slow) {
                // Grab the actual image in question
                var elem = getBottom();

                if (elem) {
                    index++;

                    var nextElem = getBottom();

                    var width = $(document).width();
                    var height = $(document).height();

                    var duration = slow ? .5 : .5;
                    if (height > width) duration *= .67;
                    //console.log(width/height);

                    var sign = left ? -1 : 1;
                    var twist = twistY;

                    console.log(twist);

                    //var ease = slow ? Strong.easeIn : Linear.easeNone;

                    sendVote(elem, sign);
                    TweenLite.to(elem, duration, {
                        x: (sign*width * 1.25),
                        rotation: (sign*twist*60) + 'deg',
                        force3D:true,
                        ease: Linear.easeOut,
                        onComplete: function() {
                            if (nextElem) {
                                fadeIn(nextElem);
                            }
                            $(elem).remove();
                            index--;
                            checkList();
                        }
                    });


//                    $(elem).translate3d([sign * width, 0, 0, sign * twist * 120], duration, function () {
//
////                        $(getBottom()).animate({
////                            opacity: 1
////                        }, {duration: 250, easing: 'linear'});
//                        $(this).remove();
//                        index--;
//                        checkList();
//                    });
                }
            }

            // Same as flipRemove, but does a skip instead.
            // TODO: Factor out common functionality into base function and extend
            function skipRemove(slow) {
                // Grab the actual image in question
                var elem = getBottom();

                if (elem) {
                    index++;

                    var nextElem = getBottom();

                    var width = $(document).width();
                    var height = $(document).height();

                    var duration = slow ? .25 : .25;
                    if (height > width) duration *= 1.2;

                    //var ease = slow ? Strong.easeIn : Linear.easeNone;

                    sendVote(elem, 0);
                    TweenLite.to(elem, duration, {
                        y: -height,
                        //rotation: (sign * twist * 120) + 'deg',
                        force3D:true,
                        ease: Linear.easeOut,
                        onComplete: function () {
                            if (nextElem) {
                                fadeIn(nextElem);
                            }
                            $(elem).remove();
                            index--;
                            checkList();
                        }
                    });
                }


//                // Grab the actual image in question
//                var elem = getBottom();
//
//                if (getBottom()) {
//                    index++;
//                    $(getBottom()).animate({
//                        opacity: 1
//                    });
//                    var duration = slow ? 1000 : 500;
//                    var height = $(document).height();
//                    var twist = 0;
//
//                    swVoteSvc.addVote($(elem).attr('data-photoid'), 0);
//                    $(elem).translate3d([0, -height, 0, twist * 120], duration, function () {
//                        $(this).remove();
//                        index--;
//                        checkList();
//                    });
//                }
            }

            // Animation function for the on-swipe's move; makes bottommost photo
            // (that is not being removed) follow the swipe
            var translateAndRotate = function (x, y, z, deg) {
                var bottom = getBottom();
                if(!bottom) return;
                TweenLite.set(bottom, {
                    x: x*1.1,
                    y: y*1.1,
                    z: z*1.1,
                    force3D:true,
                    rotation: deg + 'deg'
                });

            };
        }

        // Handlers, actions, and init
        {
            // Handles the button presses
            {
                $scope.dislike = function () {
                    twistY = .5;
                    flipRemove(true, true);
                };

                $scope.like = function () {
                    twistY = .5;
                    flipRemove(false, true);
                };

                $scope.tags = function () {
                };

                $scope.skip = function () {
                    skipRemove(true);
                };
            }

            // Listen to swipes
            $swipe.bind(element, {
                start: function (coords) {
                    endAction = null;
                    startX = coords.x;
                    startY = coords.y;
                },

                cancel: function (e) {
                    endAction = null;
                    $(getBottom()).translate3d([0, 0, 0, 0], 500);
                    e.stopPropagation();
                },

                end: function (coords, e) {
                    if (endAction == "dislike") {
                        flipRemove(true);
                    } else if (endAction == "like") {
                        flipRemove(false);
                    } else {
                        $(getBottom()).translate3d([0, 0, 0, 0], 250);
                        translateAndRotate(0, 0, 0, 0);
                    }
                    e.stopPropagation();
                },

                // TODO: Use hammer.js to do the velocity right OR Use GASP's drag plugin
                move: function (coords, e) {
                    if (startX != null && getBottom()) {
                        var now = Date.now();
                        last = last | coords.x;

                        // rough velocity calculation
                        var v = (last - coords.x) / (now - time);

                        var elem = getBottom();
                        var width = elem.clientWidth;
                        var height = elem.clientHeight;
                        var deltaYRatio = twistY = .67 - (((startY - elem.offsetParent.offsetTop) / height) / 3);

                        // Magic number 27 removes jumpiness on my Note 2 -- it has to be adjusted in the direction of the drag
                        // var deltaX = coords.x - startX < 0 ? coords.x - startX + 27 : coords.x - startX - 27;
                        var deltaX = coords.x - startX;
                        var deltaXRatio = deltaX / width;
                        // velocity needs to be
                        if (deltaXRatio >= 0.3 | (deltaXRatio > .1 && v > .67) | (deltaXRatio > .01 && v > 1) | (deltaXRatio > .001 && v > 1.34)) {
                            endAction = "like";
                        } else if (deltaXRatio <= -0.3 | (deltaXRatio < -.1 && v > .67) | (deltaXRatio < -.01 && v > 1) | (deltaXRatio < -.001 && v > 1.34)) {
                            endAction = "dislike";
                        } else {
                            endAction = null;
                        }

                        time = now;
                        last = coords.x;
                        translateAndRotate(deltaXRatio * width / (1 + (deltaYRatio)), 0, 0, deltaYRatio * deltaXRatio * 40 + (deltaXRatio * 5));
                    }
                    e.stopPropagation();
                }
            });

            // Get initial image list
            swPhotoSvc.getNextSet().then(handleImgs);

            // Listen to key presses
            $document.bind("keyup", keyPress);

            // When the user logs in, clear the stack and get them a new set.
            $rootScope.$on('logged-in', function() {
                $('.swippl-slide').fadeOut(function() {
                    $(this).remove();
                    lastSet = [];
                    checkList();
                });
            });

            // When user logs out, top off the current stack.
            $rootScope.$on('logged-out', function() {
                $('.swippl-slide').fadeOut(function() {
                    $(this).remove();
                    lastSet = [];
                    checkList();
                });
            });
        }
    }
})