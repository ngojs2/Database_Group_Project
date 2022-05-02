

var express = require('express');
var app = express();

// Credentials to access mysql
var mysql = require('./dbcon.js');

var bodyParser = require('body-parser');


// Set up handlebars
var handlebars = require('express-handlebars').create({defaultLayout:'main'});
app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));

app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');

app.set('mysql', mysql);

// Configure port
app.set('port', 5007);

app.use('/orders', require('./orders.js'));
app.use('/customers', require('./customers.js'));
app.use('/products', require('./products.js'));
app.use('/locations', require('./locations.js'));
app.use('/details', require('./details.js'));
app.use('/addDetails', require('./addDetails.js'));
app.use('/', express.static('public'));


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
