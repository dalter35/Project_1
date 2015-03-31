var mongoose = require('mongoose');
var thing_model = require('../models/thing_model');
var Thing = thing_model.Thing;
var place_model = require('../models/place_model');
var Place = place_model.Place;

var PersonSchema = new mongoose.Schema ({
    name: String,
    things : [{
        type: mongoose.Schema.ObjectId,
        ref: "Thing"    
    }],
    numberOfThings : {
        type: Number,
        default: 0
    },
    favoritePlaces: [{
        type: mongoose.Schema.ObjectId,
        ref: "Place"    
    }],
    numberOfFavoritePlaces: {
        type: Number,
        default: 0
    }
});

PersonSchema.statics.acquireThing = function(personId, thingId, cb){
    Thing.findOne({_id: thingId}, function(err, _acquiredThing){
        
       var qry = {
           _id: personId
       };
       
       var update = {
          $push: {
              things: _acquiredThing._id
          },
          $inc: {
              numberOfThings: 1
          }
       };
       
      Person.update(qry, update, function(err, _msg1, _msg2){
          
          Thing.update( {_id: thingId} , {$inc: {numberOwned: 1, numberInStock: -1}} , function(err, _msg1, _msg2) {
              
              cb();
              
          })
      });
    
    });
};

PersonSchema.statics.getAllWhoOwnThing = function(thingId, cb){
  Person.find({things :{$in: [thingId]}}, cb);  
};

PersonSchema.statics.returnThing = function(personId, thingId, cb){
    Thing.findOne({_id: thingId}, function(err, _returnedThing){
       var qry = {
           _id: personId
       };
       
       var update = {
           $pull: {
               things: _returnedThing._id
           },
           $inc: {
               numberOfThings: -1
           }
       };
       Person.update(qry, update, function(err, _msg1, _msg2){
           
           var update = {
               $inc: {
                   numberInStock: 1,
                   numberOwned: -1
               }
           };
           Thing.update({_id: thingId}, update, function(err, _msg1, _msg2){
               cb();
           })
       });
    });
};

PersonSchema.statics.addPlace= function(personId, placeId, cb){
    Place.findOne({_id: placeId}, function(err, _returnedPlace){
    
        var qry = {
            _id: placeId
        };
        
        var update ={
          $inc:{
              numberOfTimesFavorited: 1
          }
        };
        
        Place.update(qry, update, function(err, _msg1, _msg2){
          
           Person.findOne({_id:personId}, function(err, _returnedPerson){
               var qry = {
                _id: personId
                };
               
               var update = {
                   $inc: {
                       numberOfFavoritePlaces : 1
                   },
                   $push: {
                       favoritePlaces: _returnedPlace._id
                   }
               };
               
               Person.update(qry, update, function(err, _msg1, _msg2){
                   //console.log(_returnedPerson);
                  cb(err, _msg1, _msg2); 
               });
           })
        })
    });
};

PersonSchema.statics.removePlace= function(personId, placeId, cb){
    Place.findOne({_id: placeId}, function(err, _returnedPlace){
        
        var qry = {
            _id: placeId
        };
        
        var update ={
          $inc:{
              numberOfTimesFavorited: -1
          }
        };
        
        Place.update(qry, update, function(err, _msg1, _msg2){
          
           Person.findOne({_id:personId}, function(err, _returnedPerson){
               var qry = {
                _id: personId
                };
               
               var update = {
                   $inc: {
                       numberOfFavoritePlaces : -1
                   },
                   $pull: {
                       favoritePlaces: _returnedPlace._id
                   }
               };
               
               Person.update(qry, update, function(err, _msg1, _msg2){
                   //console.log(_returnedPerson);
                  cb(err, _msg1, _msg2); 
               });
           })
        })
    });
};

PersonSchema.statics.findOneByName = function(name,cb) {
    this.findOne({name: name}, cb);
};

PersonSchema.statics.findAll = function(cb){
    this.find({}, cb);  
};

PersonSchema.statics.findOneById = function(id,cb) {
    this.findOne({_id: id}, cb);
};

PersonSchema.methods.ownsThing = function(thingId){
    // if (this.indexOf(thingId) > -1) {
    //     return true
    // }
    // else {
    //     return true
    // }
    
    // SAME THING above
    return this.things.indexOf(thingId) > -1;
};

PersonSchema.statics.findAllWhoFavoritedPlace = function(placeId, cb){
  this.find({favoritePlaces:{$in: [placeId]}}, cb)  
};

var Person = mongoose.model('Person', PersonSchema);

module.exports = {
    Person: Person
}