var mongoose = require('mongoose');
var models = require('../models/models');
var Person = models.Person;
var Thing = models.Thing;
var Place = models.Place;

// var place_model = require('../models/place');
// var person_model = require('../models/person');
// var thing_model = require('../models/thing');


// var Person = person_model.Person;
// var Thing = thing_model.Thing;
// var Place = place_model.Place;

function connect (cb) {
    mongoose.connect('mongodb://localhost/the_carter');
    mongoose.connection.once('open', function(){
        cb();
    });
} //connect

function disconnect (cb) {
    mongoose.disconnect(function(){
        cb();
    });
} //disconnect

function seed(bucket) {
    var people = [
        {name: 'Brian',
        // numberOwned: 10    
        },
        {name: 'Dave',
        // numberOwned: 15
        },
        {name: 'Sean',
        // numberOwned: 20
        }
    ];
    
    var things = [
        {name: 'Whiskey'},
        {name: 'Scotch'},
        {name: 'Bourbon'}
    ];
    
    var places = [
        {name: 'London'},
        {name: 'Paris'},
        {name: 'New York'}
    ];
    
    Person.remove({}, function(){
        Person.create(people,function(err, _brian, _dave, _sean){
            Thing.remove({}, function(){
               Thing.create(things, function(err, _whiskey, _scotch, _bourbon){
                  Place.remove({}, function(){
                     Place.create(places, function(err, _london, _paris, _newyork){
                         bucket(err, 
                                _brian, 
                                _dave, 
                                _sean,
                                _whiskey, 
                                _scotch, 
                                _bourbon,
                                _london, 
                                _paris, 
                                _newyork)
                        
                     }); 
                  }); 
               }); 
            });
        });
    });
    
} //seed

module.exports = {
    connect: connect,
    disconnect: disconnect,
    seed: seed,
    
} //exports