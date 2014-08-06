var bodyParser   = require('body-parser'),
    stylus       = require('stylus'),
    logger       = require('morgan'),
    session      = require('express-session'),
    passport     = require('passport'),
    cookieParser = require('cookie-parser');

module.exports = function(app, config, express) {
    app.set('views', config.rootPath + 'server/views');
    app.set('view engine', 'jade');

    app.use(logger('dev'));
    app.use(cookieParser());
    app.use(bodyParser.json());
    //app.use(bodyParser.urlencoded());
    app.use(stylus.middleware({
        src: config.rootPath + '/public',
        compile: function (str, path) {
            return stylus(str).set('filename', path);
        }
    }));
    app.use(express.static(config.rootPath + '/public'));

    app.use(session({ secret: 'swipe till you drop' }));
    app.use(passport.initialize());
    app.use(passport.session());
}