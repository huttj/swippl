var express     = require('express'),
    config      = require('./config');

var app = express();

require('./express')(app, config, express);
require('./routes')(app);

app.listen(3030);
console.log('Listening for requests on localhost:3030 ...');