var express = require('express');
var app = express();
var path = require('path');

app.set('views', './public/views');
app.set('view engine', 'jade');

app.use(express.static(path.join(__dirname, 'public')));

app.get('/', function (req, res) {
	res.render('index');
});

app.get('/main', function (req, res) {
	res.render('main');
});

app.get('/favorite', function (req, res) {
	res.render('favorite');
});

app.get('/register', function (req, res) {
	res.render('register');
});

app.get('/info', function (req, res) {
	res.render('info');
});

app.get('/simulator', function (req, res) {
	res.render('simulator');
});

app.get('/stocks', function (req, res) {
	res.render('stocks');
});

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});