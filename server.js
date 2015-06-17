var express = require('express');
var app = express();

var env =  process.env.NODE_ENV = process.env.NODE_ENV || 'development';

app.use(express.static(__dirname + '/public'));

app.set('views', __dirname + '/server/views');
app.set('view engine', 'jade');

app.get('*', function(req, res){
	res.render('index');
});

app.listen(8080);
console.log("App listening on port 8080");