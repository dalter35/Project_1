var models = require('../models/models');
var Person = models.Person;
var db = require('../config/db');

describe("Person", function() {
    beforeEach(function(done){
        db.connect(function(){
            console.log("Connected!");
            done();
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
        expect(Person.name).toEqual('Brian');
    })
});