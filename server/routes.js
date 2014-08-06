var auth     = require('./auth'),
    passport = require('passport'),
    db       = require('./db'),
    cheerio  = require('cheerio');

module.exports = function(app) {
    /* Static Files ============= */ {
        app.get('/partials/*', function (req, res) {
            res.render('../../public/app/partials/' + req.params[0]);
        });
    }

    /* API ====================== */ {

        /* Users ================ */ {
            app.get('/api/users/:userInfo', function (req, res) {
                db.users.get(req.params.userInfo).then(function (data) {
                    res.send(data);
                });
            });

            app.get('/api/users/:UserID/liked', function (req, res) {
                db.votes.get.liked(req.params.UserID).then(function (data) {
                    res.send(data);
                });
            });
        }

        /* Photos =============== */ {
            app.get('/api/photos', function (req, res) {
                db.photos.get.byID(req.params.photoID).then(function (data) {
                    res.send(data);
                });
            });

            app.get('/api/photos/user/:userInfo', function (req, res) {
                db.photos.get.byUser(req.params.userInfo).then(function (data) {
                    res.send(data);
                });
            });

            app.get('/api/photos/set/user/:UserID', function (req, res) {
                db.photos.get.nextSetForUser(req.params.UserID).then(function (data) {
                    res.send(data);
                });
            });

            app.get('/api/photos/set', function (req, res) {
                db.photos.get.nextSet().then(function (data) {
                    res.send(data);
                });
            });


            app.get('/api/photos/all', function (req, res) {
                db.photos.get.all().then(function (data) {
                    res.send(data);
                });
            });

            app.get('/api/imgur', function (req, res) {
                request('http://www.imgur.com', function (err, response, html) {
                    if (!err) {
                        var $ = cheerio.load(html);
                        var links = [];
                        $('.image-list-link').each(function (i, element) {
                            links.push('http://i.imgur.com/' + $(this).attr('href').match(/[^\/]+$/)[0] + '.jpg');
                        });
                        res.send(links);
                    } else {
                        res.end(500);
                    }
                });
            });
        }

        /* Votes ================ */ {

            app.post('/api/votes/add/', function (req, res) {
                console.log(req.body);
                db.votes.add(
                    req.body.UserID,
                    req.body.PhotoID,
                    req.body.Vote,
                    req.body.Score,
                    req.body.SampleSize,
                    req.body.Prediction
                ).then(function (data) {
                    res.send(data)
                }).catch(function (err) {
                    res.send(err);
                });
            });
        }

        /* Utility ============== */ {

            app.get('/api/resetdb', function (req, res) {
                db.initDatabase();
                res.redirect('/');
            });

            app.post('/api/signup', function(req, res) {
                db.users.create(req.body).then(function(data) {
                    res.send({
                        result: 'success',
                        data: data
                    });
                }).catch(function(err) {
                    var response = {
                        result: 'failed'
                    }
                    if (err.message.indexOf('ER_DUP_ENTRY') > -1) {
                        response.message = 'Username already exists.';
                    } else {
                        response.message = 'An error occurred while trying to create the new user.';
                    }
                    res.send(response);
                });
            });

            app.post('/api/login', function (req, res, next) {
                passport.authenticate('local', function (err, user) {
                    if (err) return err;
                    if (!user) {
                        res.send({
                            result: "failed"
                        });
                    }
                    req.logIn(user, function (err) {
                        if (err) {
                            console.log(err);
                            return err;
                        }
                        res.send({
                            result: "success",
                            user: {
                                UserID: user.UserID,
                                Username: user.Username,
                                Email: user.Email,
                                ProfilePhoto: user.ProfilePhoto,
                                ShowNSFW: user.ShowNSFW,
                                Created: user.Created
                            }
                        });
                        return db.users.updateLastLogin(user.UserID);
                    });
                })(req, res, next);
            });
        }

    }

    /* Main Route =============== */ {
        app.get('/*', function (req, res) {
            res.render('index');
        });
    }

};