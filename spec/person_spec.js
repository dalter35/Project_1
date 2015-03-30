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
    
    describe("findOneByName", function(){
        var person;
        beforeEach(function(done){ 
            Person.findOneByName('Brian', function(err, _brian){
                person = _brian
                done();
            })
        });   
        
        it('can find brian', function(){
            expect(person.name).toEqual('Brian');
            console.log('found person by name');
        });
    })
    
    describe("findAll", function(){
       var people = [];
       beforeEach(function(done){
          Person.findAll(function(err, _peopleArray){
              people = _peopleArray;
              done();
          }) 
       });
       it('can find everyone', function(){
          expect(people.length).toEqual(3);
          console.log('found everyone');
       });
    });
    
    describe("findOneById",function(){
        var person;
        beforeEach(function(done){
            Person.findOneById(brian._id, function(err, _brian){
                person = _brian;
                done();
            });
        });
        it("should find Brian", function(){
            expect(person.name).toEqual('Brian');
            console.log('found person by id');
        })
    })
    
    describe('find all people who own specific thing', function(){
        var whiskeyOwners = [];
        beforeEach(function(done) {
            Person.acquireThing(dave._id, whiskey._id, function(err, _msg1, _msg2){
                Person.findOneByName(dave.name, function(err, _dave) {
                    Thing.findOneByName(scotch.name, function(err, _whiskey){
                        Person.acquireThing(sean._id, whiskey._id, function(err, _msg3, _msg4) {
                            Person.findOneByName(sean.name, function(err, _sean) {
                                Thing.findOneByName(whiskey.name, function(err, _whiskey) {
                                    Person.getAllWhoOwnThing(whiskey._id, function(err, _whiskeyOwners){
                                        whiskeyOwners = _whiskeyOwners;
                                        done();
                                    })
                                })
                            })
                        })
                    })
                })
            })
        })
        it('find all who own whiskey', function(){
            expect(whiskeyOwners.length).toEqual(2);
            console.log('found all whiskey owners');
        })
    })
    
    describe("acquireThing", function(){
        var person;
        var thing;
        beforeEach(function(done){
            Person.acquireThing(brian._id, scotch._id, function(){
                Person.findOneById(brian._id, function(err, _updatedBrian) {
                    person = _updatedBrian;
                    Thing.findOne({ _id: scotch._id}, function (err, _updatedScotch) {
                        thing = _updatedScotch;
                        done();
                    })
                })
            });
       });
       
        it('brian acquired Scotch', function(){
            expect(person.things[0]).toEqual(scotch._id);
            expect(thing.numberOwned).toEqual(1);
            expect(thing.numberInStock).toEqual(99);
            console.log('person acquired thing & numberOwned incremented successfully');
        });
    });
    
    describe("returnThing", function(){
        var person, thing;
        beforeEach(function(done){
            Person.acquireThing(dave._id, bourbon._id, function(){
                Person.findOneById(dave._id, function(err, _updatedDave) {
                    person = _updatedDave;
                    // console.log(_updatedDave);
                    Thing.findOne({ _id: bourbon._id}, function (err, _updatedBourbon) {
                        thing = _updatedBourbon;
                    })
                })
            });
            Person.returnThing(dave._id, bourbon._id, function(){
                Thing.findOneByName(bourbon.name, function(err, _returnedThing){
                    Person.findOneById(dave._id, function(err, _updatedPerson){
                        thing = _returnedThing;
                        person = _updatedPerson;
                        done();
                    })
                })
            })
        })
        
        it('dave retured bourbon', function(){
            expect(person.things.length).toEqual(0);
            expect(thing.numberInStock).toEqual(100);
            console.log('Person returned thing & decremented numberInStock successfully');
        })
    })
    
    describe('Person owns thing', function(){
        var person;
        beforeEach(function(done) {
             Person.acquireThing(dave._id, bourbon._id, function(){
                Person.findOneById(dave._id, function(err, _updatedDave) {
                    person = _updatedDave;
                    done();
                })
            })
        })
       it('dave owns bourbon', function(){
            expect(person.ownsThing(bourbon._id)).toEqual(true);
            console.log('person owns thing is true');
       })
        
    });
    
        describe('Person can add place', function(){
        var foundPerson, foundPlace;
        beforeEach(function(done){
            Person.addPlace(dave._id, newyork._id, function(err, _msg1, _msg2){
                Place.getOneById(newyork._id, function(err, _foundPlace){
                    Person.findOneById(dave._id, function(err, _foundPerson){
                        foundPerson = _foundPerson;
                        foundPlace = _foundPlace;
                        done();
                    })
                })
            })
        })
        it('dave added a place', function(){
             expect(foundPerson.favoritePlaces[0]).toEqual(newyork._id);
             console.log('successfully added a place');
        })
    });
    
    describe('Person can remove place', function(){
        var foundPlace, foundPerson, addedPlace;
        beforeEach(function(done){
            Person.addPlace(dave._id, newyork._id, function(err, _msg1, _msg2){
                Place.getOneById(newyork._id, function(err, _foundPlace){
                    Person.findOneById(dave._id, function(err, _foundPerson){
                        foundPerson = _foundPerson;
                        foundPlace = _foundPlace;
                            Person.removePlace(dave._id, newyork._id, function(err, _msg1, _msg2){
                                Place.getOneById(newyork._id, function(err, _foundPlace){
                                    Person.findOneById(dave._id, function(err, _foundPerson){
                                        foundPerson = _foundPerson;
                                        foundPlace = _foundPlace;
                                        done();
                                })
                            })
                        })    
                    })
                }) 
            })
        })
        
        it('dave favorites and then removes new york', function(){
            expect(foundPlace.numberOfTimesFavorited).toEqual(0);
            expect(foundPerson.favoritePlaces.length).toEqual(0);
            expect(foundPerson.numberOfFavoritePlaces).toEqual(0);
            console.log('successfully removed place');
        })
    })
    
    describe('find all people who have favorited this place', function(){
        var returnedPeople = [];
        beforeEach(function(done) {
            Person.addPlace(brian._id, newyork._id, function(err, _msg1, _msg2) {
                Person.findOneById(brian._id, function(err, _brian) {
                    Person.addPlace(dave._id, newyork._id, function(err, _msg3, _msg4) {
                        Person.findOneById(dave._id, function(err, _dave) {
                            Person.findAllWhoFavoritedPlace(newyork._id, function(err, _returnedPeople){
                            returnedPeople = _returnedPeople;
                            done();    
                            })
                        })
                    })
                })
            })
        })
        it('returns everyone who favorited NY', function(){
            expect(returnedPeople.length).toEqual(2);
            console.log('returned all who favorited place');
        })
    })
    
    
    
});