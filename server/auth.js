var passport        = require('passport'),
    LocalStrategy   = require('passport-local'),
    Promise         = require('bluebird'),
    db              = require('./db');

passport.use(new LocalStrategy(function(username, password, done) {

    db.users.get(username).then(function(user) {

        if (!user || user.length == 0 || user.Password !== password) {
            return done(null, false, {message: 'username or password incorrect'});
        }
        return done(null, user);
    });
}));

passport.serializeUser(function(user, done) {
    done(null, user.UserID);
});

passport.deserializeUser(function(id, done) {
    db.users.get(id).then(function(user) {
        done(null, user);
    }).catch(function(err) {
        done(err, false);
    });
});