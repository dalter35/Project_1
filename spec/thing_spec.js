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
    
    describe('find thing by name', function() {
        var thing;
        beforeEach(function(done){
            Thing.findOneByName(scotch.name, function(err, _foundThing){;
            thing = _foundThing;
            done();
            })
        })
        it('find scotch', function(){
            expect(thing.name).toEqual('Scotch');
            console.log('found thing by name');
        })
    })
    
    describe('find thing by id', function() {
        var thing;
        beforeEach(function(done){
            Thing.findOneById(bourbon._id, function(err, _foundId){;
            thing = _foundId;
            done();
            })
        })
        it('find bourbon', function(){
            expect(thing.name).toEqual('Bourbon');
            console.log('found thing by id');
        })
    })
    
    describe('find all things', function(){
        var allThings = [];
        beforeEach(function(done) {
            Thing.findAllThings(function(err, _allFound){
                allThings = _allFound;
                done();
                
            })
        })
        it('finds all', function(){
            expect(allThings.length).toEqual(3);
            console.log('found everything');
        })
    })
    
    describe('find all owned things', function(){
        var allOwnedThings = [];
        beforeEach(function(done){
            Person.acquireThing(dave._id, scotch._id, function(err, _msg1, _msg2){
                Person.acquireThing(brian._id, bourbon._id, function(err, _msg3, _msg4) {
                    Person.findOneByName(dave.name, function(err, _foundPerson1){
                        Thing.findOneByName(scotch.name, function(err, _foundThings1) {
                            Person.findOneByName(brian.name, function(err, _foundPerson2) {
                                Thing.findOneByName(bourbon.name, function(err, _foundThings2) {
                                    Thing.findAllOwned(function(err, _allFoundThings){
                                    allOwnedThings = _allFoundThings;
                                        done();
                                        // console.log(allOwnedThings);
                                    })
                                    
                                })
                            })
                    })
                })    
            })    
        })
    })
        
        it('find things that have > 0 numberOwned', function(){
            expect(allOwnedThings.length).toEqual(2);
            console.log('found all things that are owned');
        })
    })
    
    describe('find all unowned things', function() {
        var allUnOwnedThings;
        beforeEach(function(done) {
            Person.acquireThing(dave._id, bourbon._id, function(err, _msg1, _msg2) {
                Person.findOneByName(dave.name, function(err, _foundPerson1) {
                    Thing.findOneByName(bourbon._id, function(err, _foundThing) {
                        Thing.findAllUnOwned(function(err, _allFoundThings){
                             allUnOwnedThings = _allFoundThings;
                             done();
                        })
                    })
                })
            })
        })
        
        it('find all that have < 0 numberOwned', function(){
            expect(allUnOwnedThings.length).toEqual(2);
            console.log('found all things that are not owned');
        })
    })
    
})