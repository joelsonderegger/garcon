var mongoose = require('mongoose');
var Restaurant = require('../models/Restaurant.js');
var Member = require('../models/Member.js');
var Reservation = require('../models/Reservation.js');

// app/routes.js
module.exports = function(app, passport) {

	app.get('/', function(req, res) {
		res.render('index');
	});

	// LOGIN 
	app.get('/login', function(req, res) {
		res.render('login', { message: req.flash('loginMessage')});
	});

	// SIGNUP
	app.get('/signup', function(req, res) {
		res.render('signup', { message: req.flash('signupMessage') });
	});
	

	//PROFILE SECTION
	app.get('/profile', isLoggedIn, function(req, res) {
		res.render('profile', {
			user: req.user
		});
	});

	

	//LOGOUT
	app.get('/logout', function(req, res) {
		res.logout();
		res.redirect('/');
	});

	//LOGOUT
	app.get('/admin/logout', function(req, res) {
		res.redirect('/');
	});

	// process the signup form
	app.post('/signup', passport.authenticate('local-signup', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/signup', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));

	// process the login form
	app.post('/login', passport.authenticate('local-login', {
		successRedirect : '/profile', // redirect to the secure profile section
		failureRedirect : '/login', // redirect back to the signup page if there is an error
		failureFlash : true // allow flash messages
	}));


	// Admin
	app.get('/admin', function(req, res) {
		res.redirect('/admin/dashboard');
	});

	//RESTAURANT SECTION
	app.get('/admin/restaurants', function(req, res) {
		res.render('restaurant', {
			title: 'Restaurants',
  			layout: 'layout/admin'
		});
	});

	/* GET Member Section */
	app.get('/admin/members', function(req, res) {
		res.render('members', {
			title: 'Members',
  			layout: 'layout/admin'
		});
	});

	app.get('/admin/dashboard', function(req,res){
		res.render('dashboard', {
			title: 'Dashboard',
  			layout: 'layout/admin'
		});
	});

	/* RESERVATIONS */
	app.get('/admin/reservations', function(req,res){
		res.render('reservations', {
			title: 'Reservations',
  			layout: 'layout/admin'
		});
	});



	// API
	app.post('/addrestaurant', function(req, res){
		var newrestaurant = req.body;

  		Restaurant.addRestaurant(newrestaurant, function(err, restaurant) {
    		if (err) throw err;
			res.json(true);
  		});
	});

	app.post('/updaterestaurant/:id', function(req, res){
	
		var restaurant = req.body;
		restaurant.id = req.params.id;
		
  		Restaurant.updateRestaurant(restaurant, function(err, restaurant) {
    		if (err) throw err;
    		
			res.json(true);
  		});
	});

	/* GET Userlist page. */
	app.get('/restaurantlist', function(req, res){
		Restaurant.findAllRestaurants(function(p) {
    		res.json(p);
		});
	});

	/* GET restaurant information */
	app.get('/restaurant/:id', function(req, res){
		var id = req.params.id;
		Restaurant.findRestaurant(req.params.id, function(p) {
    		res.json(p);
		});
	});

	/* DELETE restaurant (according to id) */
	app.delete('/restaurant/:id', function(req, res){
		var id = req.params.id;
		Restaurant.removeRestaurant(req.params.id, function(p) {
    		res.json(true);
		});
	});
	
	

	/* GET Memberlist */
	app.get('/memberlist', function(req, res){
		Member.findAllMembers(function(memberlist) {
			console.log(memberlist);
			res.json(memberlist);
		})
	});

	/* GET Member Information */
	app.get('/api/members/:id', function(req, res){
		var restaurantid = req.params.id;
		Member.findMember(restaurantid, function(p) {
			res.json(p);
		});
	});

	/* Add Member */
	app.post('/member', function(req, res) {
		var member = req.body;

		Member.addMember(member, function(err, member) {
			if (err){
				throw err;
			}else{
				res.json(true);
			}
		});
	});

	/* DELETE Member (according to id) */
	app.delete('/member/:id', function(req, res) {
		Member.removeMember(req.params.id, function(p) {
			res.json(true);
		});
	});

	app.post('/api/updatemember/:id', function(req, res){
	
		var member = req.body;
		member.id = req.params.id;

		console.log(member);

  		Member.updateMember(member, function(err, member) {
    		if (err) throw err;
    		
			res.json(true);
  		});
	});

	

	app.get('/api/reservations', function(req,res){
		Reservation.findAllReservations(function(reservationslist){
			res.json(reservationslist);
		});
	});

	/* Add Reservation */
	app.post('/reservations', function(req, res) {
		var reservation = req.body;

		Reservation.addReservation(reservation, function(err, reservation) {
			if (err){
				throw err;
			}else{
				res.json(true);
			}
		});
	});


};

function isLoggedIn(req, res, next) {
	if (req.isAuthenticated())
		return next();

	res.redirect('/');
}