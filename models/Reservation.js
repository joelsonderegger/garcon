var db = require('../lib/db');

var ReservationSchema = new db.Schema({
  userid : Number,
  restaurantid : Number,
  time: {type: Date},
  confirmed : Boolean
})

var Reservation = db.mongoose.model('Reservation', ReservationSchema);

// Exports
module.exports.addReservation = addReservation;
module.exports.removeReservation = removeReservation;
module.exports.confirmReservation = confirmReservation;
module.exports.findAllReservations = findAllReservation;


// Find Reservations
function findAllReservation(callback) {
  Reservation.find(function(err, reservations) {
    if (err) return console.error(err);
    callback(reservations);
  });
}

// Add Reservation to database
function addReservation(reservation, callback) {
  
  var instance = newReservation();

  instance.userid = reservation.userid;
  instance.restaurantid = reservation.restaurantid;
  instance.time = reservation.time;

  instance.save(function (err) {
    if(err) {
      return console.error(err);
    }
    else {
      callback(null, instance);
    }
  });
}

// Remove Reservation
function removeReservation(idxd, callback) {
  Reservation.remove({ _id: idxd}, function(err, reservation){
    if (err) return console.error(err);
    callback(reservation);
  });
}

// Confirm Reservation
function confirmReservation(idxd, callback){
  // TODO
}
