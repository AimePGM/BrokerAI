var path = require('path');
var express = require('express')
, cors = require('cors')
, app = express();

app.use(cors());

app.set('views', __dirname+'/public/views');
app.use(express.static(path.join(__dirname, 'public')));

// app.use(function(req, res, next) {
//   res.header("Access-Control-Allow-Origin", "*");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
//   next();
// });
app.get('/*', function (req, res) {
	res.sendFile(__dirname+'/public/common.html');
});

// app.get('/main', function (req, res) {
// 	res.render('main');
// });

// app.get('/favorite', function (req, res) {
// 	res.render('favorite');
// });

// app.get('/register', function (req, res) {
// 	res.render('register');
// });

// app.get('/info', function (req, res) {
// 	res.render('info');
// });

// app.get('/simulator', function (req, res) {
// 	res.render('simulator');
// });

// app.get('/stocks', function (req, res) {
// 	res.render('stocks');
// });

var server = app.listen(3000, function () {

  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);

});