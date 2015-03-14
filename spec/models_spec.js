var models = require('../models/models');
var Person = models.Person;
var db = require('../config/db');

describe("Person", function() {
    var brian, dave, sean;
    beforeEach(function(done){
        db.connect(function(){
            console.log("Connected!");
            db.seed(function bucket (err, _brian, _dave, _sean){
                brian = _brian;
                dave = _dave;
                sean = _sean;
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
    it("is defined", function() {
        expect(Person).toBeDefined();
    })
    it("has a defined name attribute", function() {
        
        expect(Person.name).toBeDefined();
    })
    it("is named Brian", function(){
        expect(brian.name).toEqual('Brian');
    })
    it("is named Dave", function(){
        expect(dave.name).toEqual('Dave');
    }) //miscellaneous tests
    
    
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
       it('can find every mothafucka, mothafucka.', function(){
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
});