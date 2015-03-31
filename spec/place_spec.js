// var models = require('../models/models');
// var Person = models.Person;
// var Thing = models.Thing;
// var Place = models.Place;

var place_model = require('../models/place_model');
var person_model = require('../models/person_model');
var thing_model = require('../models/thing_model');
var Person = person_model.Person;
var Thing = thing_model.Thing;
var Place = place_model.Place;

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
    
    describe('return all favorited places', function() {
        var returnedNY, returnedParis, favPlaces = [];
        beforeEach(function(done) {
           Person.addPlace(dave._id, newyork._id, function(err, _msg1, _msg2){
                Place.getOneById(newyork._id, function(err, _returnedNewYork) {
                    Person.addPlace(brian._id, paris._id, function(err, _msg3, _msg4) {
                        Place.getOneById(paris._id, function(err, _returnedParis){
                            Place.getAllFavorited(function(err, _allFavorites){
                                favPlaces = _allFavorites;
                                done();    
                                })
                              })
                            })
                        })
                    });
                })
            it('finds all favorites', function(){
                expect(favPlaces.length).toEqual(2);
                console.log('found all favorited places');
            })
        })
        
    describe('return all place that are not favorited', function(){
        var allUnOwnedPlaces;
        beforeEach(function(done){
            Person.addPlace(sean._id, paris._id, function(err, _msg1, _msg2) {
                Place.getOneById(paris._id, function(err, _returnedParis) {
                    Place.getAllUnFavorited(function(err, _returnedPlaces){
                    allUnOwnedPlaces = _returnedPlaces;
                    done();
                    })
                })
            })
        })
        it('finds all places that are not favorited', function(){
            expect(allUnOwnedPlaces.length).toEqual(2);
            console.log('found all places that suck (unfavorited)');
        })
    })
    
});