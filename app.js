
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
//app.set('view engine', 'jade');
app.set('view engine', 'ejs');

app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
//app.use(require('stylus').middleware(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'public')));

//var portNumber = "11427";
//var password = "deepblue";
//var endpoint = "pub-redis-11427.us-east-1-2.3.ec2.garantiadata.com";

//var redis = require('redis');
//var client = redis.createClient(portNumber, endpoint, { auth_pass: password });

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}

//app.get('/', routes.index);


app.get('/', routes.orders);
app.get('/add', routes.addOrder);
app.get('/edit/:id', routes.editOrder);
app.get('/delete/:id', routes.deleteOrder);
app.post('/saveOrder', routes.saveOrder);


http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});
