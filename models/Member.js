var db = require('../lib/db');

var MemberSchema = new db.Schema({
  memberid : {type: Number, unique: false},
  firstname : {type: String, unique: false},
  middlename : {type: String, unique: false},
  lastname : {type: String, unique: false},
  birthday: {type: Date, unique: false},
  address : {
    street : {
      name: {type: String, unique: false},
      nr: {type: Number, unique: false}
    },
    zip : {type: Number, unique: false},
    city : {type: String, unique: false},
    country : {type: String, unique: false}
  },
  email: {type: String, unique: false},
  created: {type: Date, default: Date.now}
})

var Member = db.mongoose.model('Member', MemberSchema);

// Exports
module.exports.addMember = addMember;
module.exports.findAllMembers = findAllMembers;
module.exports.findMember = findMember;
module.exports.removeMember = removeMember;
module.exports.updateMember = updateMember;

// Find members
function findAllMembers (callback) {
  Member.find(function(err, restaurants) {
    if (err) return console.error(err);
    callback(restaurants);
  });
}

// Find member for _id
function findMember(idxd, callback) {
  Member.findOne(
    {
      _id: idxd 
    }, 
    function(err,member) {
      if (err) return console.error(err);
      callback(member);
    });
}

// Add Member to database
function addMember(member, callback) {

  var instance = new Member();

 
  // TO-DO: Member-ID generieren
  instance.memberid = "0000000";
  instance.firstname = member.firstname;
  instance.middlename = member.middlename;
  instance.lastname = member.lastname;
  instance.birthday = member.birthday;
  instance.address.street.name = member.address.street.name;
  instance.address.street.nr = member.address.street.nr;
  instance.address.zip = member.address.zip;
  instance.address.city = member.address.city;
  instance.address.country = member.address.country;
  instance.email = member.email;

  instance.save( function (err) {
    if (err){
      callback(err);
    }else{
      callback(null, instance);
    }
  });
}

// Delete member 
function removeMember(idxd, callback) {
  Member.remove({ _id: idxd }, function(err, member){
    if(err) return console.error(err);
    callback(member);
  });
}

// Update member
function updateMember(member, callback) {
  var query = {"_id": member.id};
  var update = member;
  var options = {new: true};
  Member.findOneAndUpdate(query, update, options, function(err, member) {
    if (err) {
      console.log('got an error');
    }
    member.save(callback);
  });
}