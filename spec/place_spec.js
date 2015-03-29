var models = require('../models/models');
var Person = models.Person;
var Thing = models.Thing;
var Place = models.Place;
var db = require('../config/db');

describe("Person + Place + Thing", function() {
    var brian, dave, sean, whiskey, scotch, bourbon, london, paris, newyork;
    beforeEach(function(done){
        db.connect(function(){
            console.log("Connected!");
            db.seed(function (err, _brian, _dave, _sean, _whiskey, _scotch, _bourbon, _london, _paris, _newyork){
                brian = _brian;
                dave = _dave;
                sean = _sean;
                whiskey = _whiskey;
                scotch = _scotch;
                bourbon = _bourbon;
                london = _london;
                paris = _paris;
                newyork = _newyork;
                done();
            })
        });
    });
    afterEach(function(done){
        db.disconnect(function(){
            console.log("Disconnecting...");
            done();
        });
    });
    
    describe('find place by name', function(){
        var place;
        beforeEach(function(done){
           Place.getOneByName(paris.name, function(err, _returnedPlace){
           place = _returnedPlace;
           done();
       })
        })
        
       it('can find paris by name', function(){
           expect(place.name).toEqual('Paris');
           console.log('found place by name');
       })
    });
    
    describe('find place by id', function(){
        var place;
        beforeEach(function(done){
            Place.getOneById(paris._id, function(err, _returnedPlace){
                place = _returnedPlace;
                done();
            })
        })
        it('can find paris by id', function(){
            expect(place.name).toEqual('Paris');
            console.log('found place by id');
        })
    });
    
    describe('get all places', function(){
        var places = [];
        beforeEach(function(done) {
            Place.getAll(function(err, _allPlaces){
                places = _allPlaces;
                done();
            })
        })
        it('returns all places', function(){
            expect(places.length).toEqual(3);
            console.log('found all places');
        })
    })
    
});