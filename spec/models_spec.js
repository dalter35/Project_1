var models = require('../models/models');
var Person = models.Person;
var db = require('../config/db');

describe("Person", function() {
    var brian, dave, sean;
    beforeEach(function(done){
        db.connect(function(){
            console.log("Connected!");
            db.seed(function(err, _brian, _dave, _sean){
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
    })
});