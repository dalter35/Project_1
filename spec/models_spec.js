var models = require('../models/models');
var Person = models.Person;
var Thing = models.Thing;
var Place = models.Place;
var db = require('../config/db');

describe("Person and Thing", function() {
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
    it("Person is defined", function() {
        expect(Person).toBeDefined();
    })
    it("Person has a defined name attribute", function() {
        
        expect(Person.name).toBeDefined();
    })
    it("Person is named Brian", function(){
        expect(brian.name).toEqual('Brian');
    })
    it("Person is named Dave", function(){
        expect(dave.name).toEqual('Dave');
    }) //miscellaneous tests
    
    it("Thing is defined", function() {
        expect(Thing.name).toBeDefined();
    })
    
    it("Thing will be Scotch", function(){
        expect(scotch.name).toEqual('Scotch');
    })
    
    describe("Thing - findOneByName", function(){
        var thing;
        beforeEach(function(done){
            Thing.findOneByName('Scotch', function(err, _scotch){
                thing = _scotch
                done();
            })
        })
        
        it('can find scotch', function(){
            expect(thing.name).toEqual('Scotch');
            console.log('scotch is found');
        })
    });
    
    describe("Person - findOneByName", function(){
        var person;
        beforeEach(function(done){ 
            Person.findOneByName('Brian', function(err, _brian){
                person = _brian
                done();
            })
        });   
        
        it('can find brian', function(){
            expect(person.name).toEqual('Brian');
        });
    }); //findOneByName test
    
    describe("findAll", function(){
       var people = [];
       beforeEach(function(done){
          Person.findAll(function(err, _peopleArray){
              people = _peopleArray;
              done();
          }) 
       });
       it('can find everyone', function(){
        //   console.log(people);
          expect(people.length).toEqual(3); 
       });
    }); //findAll test
    
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
        })
    }) //findOneById test
    
    describe("acquireThing", function(){
        var person;
        var thing;
        beforeEach(function(done){
            Person.acquireThing(brian._id, scotch._id, function(){
                console.log('about to grab updated brian')
                Person.findOneById(brian._id, function(err, _updatedBrian) {
                    //console.log(_updatedBrian);
                    person = _updatedBrian;
                    console.log("about to check thing")
                    Thing.findOne({ _id: scotch._id}, function (err, _updatedScotch) {
                        thing = _updatedScotch;
                        //console.log(thing);
                        done();
                    })
                })
            });
       });
       
        it('brian acquired Scotch', function(){
            expect(person.things[0]).toEqual(scotch._id);
        });
        
        it("scotch numberOwned incremented", function() {
            expect(thing.numberOwned).toEqual(1);
        })
        
    });
    describe("returnThing", function(){
        var person, thing;
        beforeEach(function(done){
            Person.acquireThing(dave._id, bourbon._id, function(){
                //console.log('about to grab updated brian')
                Person.findOneById(dave._id, function(err, _updatedDave) {
                    //console.log(_updatedBrian);
                    person = _updatedDave;
                    //console.log("about to check thing")
                    Thing.findOne({ _id: bourbon._id}, function (err, _updatedBourbon) {
                        thing = _updatedBourbon;
                        //console.log(thing);
                       
                    })
                })
            });
            console.log('acquired THING');
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
        })
    })
    
    describe('owns thing', function(){
        var person;
        beforeEach(function(done) {
             Person.acquireThing(dave._id, bourbon._id, function(){
                //console.log('about to grab updated brian')
                Person.findOneById(dave._id, function(err, _updatedDave) {
                    //console.log(_updatedBrian);
                    person = _updatedDave;
                    console.log(bourbon._id);
                    done();
                })
            });
            
       it('dave owns bourbon', function(){
            expect(person.ownsThing(bourbon._id)).toEqual(true);
       })
        });
       
        
    })
    
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
           //console.log(place);
            expect(place.name).toEqual('Paris');
        })
    });
    
    describe('get all places', function(){
        var places = [];
        beforeEach(function(done) {
            Place.getAll(function(err, _allPlaces){
                places = _allPlaces;
                // console.log(places);
                done();
            })
        })
        it('returns all places', function(){
            
            expect(places.length).toEqual(3);
        })
    })
    
    describe('add place test', function(){
        var foundPlace, foundPerson, addedPlace;
        beforeEach(function(done){
            Person.addPlace(dave._id, newyork._id, function(err, _msg1, _msg2){
              
                Place.getOneById(newyork._id, function(err, _foundPlace){
                    Person.findOneById(dave._id, function(err, _foundPerson){
                        foundPerson = _foundPerson;
                        foundPlace = _foundPlace;
                       //  console.log(foundPerson);
                        // console.log(foundPlace);
                            Person.removePlace(dave._id, newyork._id, function(err, _msg1, _msg2){
              
                            Place.getOneById(newyork._id, function(err, _foundPlace){
                                Person.findOneById(dave._id, function(err, _foundPerson){
                                    foundPerson = _foundPerson;
                                    foundPlace = _foundPlace;
                                    // console.log(foundPerson);
                                    // console.log(foundPlace);
                                    done();
                        
                    })
                    
                })
                
            })
                        
                    })
                    
                })
                
            })
        })
        it('dave favorites and then removes new york', function(){
            
    
             
            //expect(foundPerson.favoritePlaces[0]).toEqual(newyork._id);
            expect(foundPlace.numberOfTimesFavorited).toEqual(0);
            expect(foundPerson.favoritePlaces.length).toEqual(0);
            expect(foundPerson.numberOfFavoritePlaces).toEqual(0);
        })
        
        // describe('remove place test', function(){
            
        //     afterEach(function(done) {
        //         Person.removePlace(dave._id, newyork._id, function(err, _msg1, _msg2){
              
        //         Place.getOneById(newyork._id, function(err, _foundPlace){
        //             Person.findOneById(dave._id, function(err, _foundPerson){
        //                 foundPerson = _foundPerson;
        //                 foundPlace = _foundPlace;
        //                 done();
                        
        //             })
                    
        //         })
                
        //     })
            
        //     })
        //     it('dave removes newyork', function(){
        //         expect(foundPlace.numberOfTimesFavorited).toEqual(0);
        //     })
            
        // })
    })
    
    describe('return all favorited places', function() {
        var returnedNY, returnedParis, favPlaces = [];
        beforeEach(function(done) {
           
            Person.addPlace(dave._id, newyork._id, function(err, _msg1, _msg2){
                Place.getOneById(newyork._id, function(err, _returnedNewYork) {
                    Person.addPlace(brian._id, paris._id, function(err, _msg3, _msg4) {
                        Place.getOneById(paris._id, function(err, _returnedParis){
                            
                             // console.log(_returnedParis);
                            // console.log(_returnedNewYork);
                                Place.getAllFavorited(function(err, _allFavorites){
                                    favPlaces = _allFavorites;
                                    //console.log(favPlaces);
                                    done();    
                                })
                              })
                            })
                        })
                    });
                })
            it('finds all favorites', function(){
                expect(favPlaces.length).toEqual(2);
            })
        })
    describe('return all Unfavorited Places', function(){
        var unFavPlaces = [];
        beforeEach(function(done) {
            Person.addPlace(brian._id, newyork._id, function(err, _msg1, _msg2) {
                Place.getOneById(newyork._id, function(err, _returnedPlace) {
                    
                    Place.getAllUnFavorited(function(err, _allUnFavorited){
                        
                        unFavPlaces = _allUnFavorited;
                        // console.log(_allUnFavorited);
                        done();
                    })
                    
                })
            })
        })
        it('returns paris and london bc they arent favorited', function(){
            expect(unFavPlaces.length).toEqual(2);
        })
    })
});