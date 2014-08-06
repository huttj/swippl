

angular.module('Swippl', ['ngResource', 'ngRoute', 'ngTouch'])

//    .directive('swSwippl', function($swipe, $q, $document, swVoteSvc) {
//        return function(scope, element, attrs) {
//
//            var startX      = null;
//            var startY      = null;
//            var endAction   = "cancel";
//
//
//
//
//            function makeImg(url) {
//                var img = angular.element('<div/>');
//                img.classlist = 'swippl-slide';
//                img.css({
//                    background: 'url("' + url + '")',
//                });
//                return img;
//            }
//
//            function getBottom() {
//                return element.find('div')[1];
//            }
//            function getTop() {
//                return element.find('div')[0];
//            }
//
//
//            var translateAndRotate = function(elem, x, y, z, deg) {
//                var css = "translate3d(" + x + "px," + y + "px," + z + "px) rotate(" + deg + "deg)";
//                ["-webkit-transform", "-moz-transform", "-ms-transform", "-o-transform", "transform"].forEach(function(n) {
//                    elem.style[n] = css;
//                });
//            };
//
//            var moveTop = function(x,y,z,deg) {
//                translateAndRotate(getTop(),x,y,z,deg);
//            };
//
//            var moveBottom = function(x,y,z,deg) {
//                translateAndRotate(getBottom(),x,y,z,deg);
//            };
//
//
//            function keyPress(e) {
//                twistY = .5;
//                if (e.which === 37) {
//                    flipRemove(true, true, getBottom().clientWidth);
//                    e.stopPropagation();
//                } else if (e.which === 39) {
//                    flipRemove(false, true, getBottom().clientWidth);
//                    e.stopPropagation();
//                }
//            }
//
//            function flipRemove(left, slow, width) {
//                var duration = slow ? 1300 : 750;
//                var sign = left ? -1 : 1;
//                var twist = twistY;
//                width = width | 2000;
//
//                voteSvc.addVote(1, currentPhoto, sign);
//                $(getBottom()).translate3d([sign*width, 0, 0, sign * twist * 120], duration, function () {
//                    $(this).remove();
//                });
//                addNext();
//            }
//
////            $document.bind("keydown", $.throttle(750, true, keyPress));
//            $document.bind("keyup", keyPress);
//
//            var twistY;
//            var time = Date.now();
//            var last;
//            $swipe.bind(element, {
//                start: function(coords)  {
//                    endAction = null;
//                    startX = coords.x;
//                    startY = coords.y;
//                },
//
//                cancel: function(e)  {
//                    endAction = null;
//                    $(getBottom()).translate3d([0,0,0,0], 500);
//                    e.stopPropagation();
//                },
//
//                end: function(coords, e)  {
//                    if (endAction == "dislike") {
//                        flipRemove(true, null, getBottom().clientWidth);
//                    } else if (endAction == "like") {
//                        flipRemove(false, null, getBottom().clientWidth);
//                    } else {
//                        $(getBottom()).translate3d([0,0,0,0], 250);
//                        moveBottom(0, 0, 0, 0);
//                    }
//                    e.stopPropagation();
//                },
//
//                // TODO: Use hammer.js to do the velocity right
//                move: function(coords, e)  {
//                    if (startX != null) {
//                        var now = Date.now();
//                        last = last | coords.x;
//
//                        // rough velocity calculation
//                        var v = (last - coords.x) / (now - time);
//
//                        // Magic number 27 removes jumpiness on my Note 2 -- it has to be adjusted in the direction of the drag
//                        // TODO: Fix jump when dragging across the middle
//                        var width = getBottom().clientWidth;
//                        var height = getBottom().clientHeight;
//                        var deltaYRatio = twistY = 1 - (startY / height);
//
//                        // var deltaX = coords.x - startX < 0 ? coords.x - startX + 27 : coords.x - startX - 27;
//                        var deltaX = coords.x - startX;
//                        var deltaXRatio = deltaX / getBottom().clientWidth;
//                        // velocity needs to be
//                        if (deltaXRatio >= 0.3 | (deltaXRatio >  .1 && v > .67) | (deltaXRatio >  .01 && v > 1) | (deltaXRatio >  .001 && v > 1.34)) {
//                            endAction = "like";
//                        } else if (deltaXRatio <= -0.3  | (deltaXRatio < -.1 && v > .67) | (deltaXRatio < -.01 && v > 1) | (deltaXRatio < -.001 && v > 1.34)) {
//                            endAction = "dislike";
//                        } else {
//                            endAction = null;
//                        }
//
//                        time = now;
//                        last = coords.x;
//                        moveBottom(deltaXRatio * width / (1 + (deltaYRatio)), 0, 0, deltaYRatio * deltaXRatio * 40 + (deltaXRatio * 5));
//                    }
//                    e.stopPropagation();
//                }
//            });
//        };
//    });