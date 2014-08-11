var db = require('../lib/db');

var RestaurantSchema = new db.Schema({
  name : {type: String, unique: false},
  address : {
    street : {
      name: {type: String, unique: false},
      nr: Number
    },
    zip : Number,
    city : {type: String, unique: false},
    country : {type: String, unique: false}
  },
  url : {type: String, unique: false},
  openinghours : {
    openh: Number,
    openm: Number,
    closeh: Number,
    closem: Number
  },
  created: {type: Date, default: Date.now}
})

var MyRestaurant = db.mongoose.model('Restaurant', RestaurantSchema);

// Exports
module.exports.addRestaurant = addRestaurant;
module.exports.findAllRestaurants = findAllRestaurants;
module.exports.findRestaurant = findRestaurant;
module.exports.removeRestaurant = removeRestaurant;
module.exports.updateRestaurant = updateRestaurant;

// Add restaurant to database
function addRestaurant(newrestaurant, callback) {


  var instance = new MyRestaurant();
  instance.name = newrestaurant.name;
  instance.address.street.name = newrestaurant.streetname;
  instance.address.street.nr = newrestaurant.streetnr;
  instance.address.zip = newrestaurant.zip;
  instance.address.city = newrestaurant.city;
  instance.address.country = newrestaurant.country;
  instance.url = newrestaurant.url;
  instance.openinghours.openh = newrestaurant.openh;
  instance.openinghours.openm = newrestaurant.openm;
  instance.openinghours.closeh = newrestaurant.closeh;
  instance.openinghours.closem = newrestaurant.closem;

  instance.save(function (err) {
    if (err) {
      callback(err);
    }
    else {
      callback(null, instance);
    }
  });
}

// Find restaurants
function findAllRestaurants(callback) {
  MyRestaurant.find(function(err, restaurants) {
    if (err) return console.error(err);
    callback(restaurants);
  });
}

// Find restaurant for ID
function findRestaurant(idxd, callback) {
  MyRestaurant.findOne({ _id: idxd }, function(err, restaurant) {
    if (err) return console.error(err);
    callback(restaurant);
  });
}

// Delete restaurant
function removeRestaurant(idxd, callback) {
  MyRestaurant.remove({ _id: idxd }, function(err, restaurant) {
    if (err) return console.error(err);
    callback(restaurant);
  });
}

// Update restaurant
function updateRestaurant(newrestaurant, callback) {
  var query = {"_id": newrestaurant.id};
  var update = {
    name : newrestaurant.name,
    address: {
      street: { 
        name : newrestaurant.streetname,
        nr : newrestaurant.streetnr
      },
      zip : newrestaurant.zip,
      city : newrestaurant.city,
      country : newrestaurant.country
    },
    url : newrestaurant.url,
    openinghours:{
      openh : newrestaurant.openh,
      openm : newrestaurant.openm,
      closeh : newrestaurant.closeh,
      closem : newrestaurant.closem
    }
  };
  var options = {new: true};
  MyRestaurant.findOneAndUpdate(query, update, options, function(err, newrestaurant) {
    if (err) {
      console.log('got an error');
    }
    newrestaurant.save(callback);
  });
}
