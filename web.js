var express = require('express');
var path = require('path');
var favicon = require('static-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var hbs = require('hbs');
var mongoose = require('mongoose');
var passport = require('passport');
var flash 	 = require('connect-flash');
var logger = require('morgan');
var session      = require('express-session');




/*
var fs = require('fs');
var hbs = require('hbs');
//var Quote = require('./models/Quote.js');
var routes = require('./routes');
var moment = require('moment');
var mongoose = require('mongoose');
var passport = require('passport');

*/

var app = express();
//app.use(express.logger());

var configDB = require('./config/database.js');
db = mongoose.connect(configDB.url); // connect to our database


require('./config/passport')(passport); // pass passport for configuration

var Restaurant = require('./models/Restaurant.js');

app.use(express.static(path.join(__dirname, 'public')));
	app.use(logger('dev')); // log every request to the console
	app.use(cookieParser()); // read cookies (needed for auth)
    app.use(bodyParser());
    app.use(bodyParser.json());
	app.use(bodyParser.urlencoded());

	// required for passport
	app.use(session({ 	secret: 'ilovescotchscotchyscotchscotch', // session secret
             			cookie:{_expires : 60000000} // time im ms
              		})); 
	app.use(passport.initialize());
	app.use(passport.session()); // persistent login sessions
	app.use(flash()); // use connect-flash for flash messages stored in session


var blogEngine = require('./dailyquotare');
app.set('view engine', 'html');
app.engine('html', hbs.__express);
app.use(bodyParser());

//Make our db accessible to our router
app.use(function(req,res,next){
    req.db = db;
    next();
});

hbs.registerHelper('prettifyDate', function(unformated) {
  return moment(unformated).format('DD.MM.YYYY');
});

hbs.registerHelper('datehtmlformated', function(unformated) {
  return moment(unformated).format('YYYY-MM-DD');
});



/*
app.get('/', function(req, res){

	req.session.user={firstname:"Thomas",lastname:"Stoeckel"};
    
    res.render('launchscreen',{title:"Welcome"});
});

app.get('/definereservationrequest', function(req, res){

	/*
	if (req.session.date != "" && req.session.restime != "" && req.session.guest != ""){

	}
	*//*
	console.log(req.session.date);

	res.render('definereservationrequest',{
		title:""
	});
});

app.get('/add', function(req, res){
	res.render('add', {title:""});
});

app.post('/requestconfirmation', function(req, res){
	req.session.restaurantname = req.body.restaurantname;
	res.render('requestconfirmation', {title:"Battle", restaurantname:req.session.restaurantname, lastname:req.session.user.lastname});
	}
);

app.post('/selectrestaurant', function(req, res){

	req.session.date = new Date(req.body.date.replace( /(\d{2})-(\d{2})-(\d{4})/, "$2/$1/$3"));
	req.session.restime = req.body.restime;
	req.session.guest = req.body.guest;

	res.render('selectrestaurant',{
		title:"Select Restaurant",
		restaurants: restaurants,
		footer: "<div class='row'><div class='col-xs-4'><a href='/definereservationrequest'><div class='backbutton'></div></a></div><div class='col-xs-4'></div><div class='col-xs-4'><a href='/foodselection'><div class='forwardbutton'></div></a></div></div>"});

});

app.get('/selectrestaurant', function(req, res){
	res.render('selectrestaurant',{
		title:"Select Restaurant",
		restaurants: restaurants,
		footer: "<div class='row'><div class='col-xs-4'><a href='/definereservationrequest'><div class='backbutton'></div></a></div><div class='col-xs-4'></div><div class='col-xs-4'><a href='/foodselection'><div class='forwardbutton'></div></a></div></div>"});

});

app.post('/requestreservation', function(req, res){
		res.redirect("/selectrestaurant");
	}
);

app.get('/foodselection', function(req, res){

	var menu = restaurants.filter(function (restaurant) { return restaurant.name == req.session.restaurantname });

	res.render('foodselection', {
		title:"Menu Selection",
		menus: menu[0].menu,
		footer: "<div class='row'><div class='col-xs-4'><a href='/selectrestaurant'><div class='backbutton'></div></a></div><div class='col-xs-4'></div><div class='col-xs-4'><a href='/submitorder'><div class='forwardbutton'></div></a></div></div>"});
});

app.get('/submitorder', function(req, res){

	res.render('submitorder', {
		title:"Submit Order",
		footer: "<div class='row'><div class='col-xs-4'><a href='/foodselection'><div class='backbutton'></div></a></div><div class='col-xs-4'></div><div class='col-xs-4'></div></div>"});
});

app.get('/orderconfirmation', function(req, res){
	res.render('orderconfirmation', {
		title:"Confirmation",
		lastname:req.session.user.lastname,
		restime:req.session.restime,
		date:req.session.date,
		restaurant:req.session.restaurantname
	});
});
*/
// routes ======================================================================
require('./app/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport
/*
app.get('/', function(req, res){
	 res.redirect('/showroom');
});

app.get('/upload', function(req, res){
	res.render('upload', {title:"Battle"});
});

app.post('/uploadsubmit', function(req, res){
	fs.readFile(req.files.image.path, function (err, data) {

		var imageName = req.files.image.name
		var imgId;
		/// If there's an error
		if(!imageName){
			console.log("There was an error")
			res.redirect("/");
			res.end();

		} else {
			var description = req.body.description;
  			Sneaker.addSneaker(description, function(err, sneaker) {
    		if (err) throw err;
    		var newPath = __dirname + '/public/img/uploads/fullsize/' + sneaker._id +'.png';

		 	/// write file to uploads/fullsize folder
		  	fs.writeFile(newPath, data, function (err) {

		  	/// redirect to root
		  	res.redirect("/");
		  });
  		});		  
		}
	});
});



app.get('/battle', function(req, res){
	res.render('battle', {title:"Battle"});
});

app.get('/showroom', function(req, res){
	Sneaker.findAllSneaker(function(p) {
    	res.render('showroom',{title:"My Blog", sneakers:p});
  	});
});

app.get('/showroom/popular', function(req, res){
	Sneaker.findAllSneakerPopular(function(p) {
    	res.render('showroom',{title:"Popular", sneakers:p});
  	});
});

app.get('/showroom/new', function(req, res){
	Sneaker.findAllSneakerNew(function(p) {
    	res.render('showroom',{title:"New", sneakers:p});
  	});
});

app.get('/showroom/editorschoice', function(req, res){
	Sneaker.findAllSneakerEditorChoice(function(p) {
    	res.render('showroom',{title:"Editor's Choice", sneakers:p});
  	});
});


app.get('/sneaker/:id', function(req, res){
	
	Sneaker.findOne(req.params.id, function(p){
		res.render('article',{title:"test", sneaker:p});
	});

});

app.get('/admin', function(req, res){
    	res.render('admin',{title:"Editor's Choice"});
});

*/

app.get('bootstrapelements', function(req, res){
	res.render('bootstrapelements', {title:"bootstrapelements"});
});

var port = process.env.PORT || 8080;
app.listen(port, function() {
  console.log("Listening on " + port);
});
