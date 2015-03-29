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
    
});