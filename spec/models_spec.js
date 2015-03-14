var models = require('../models/models');
var Person = models.Person;

describe("Person", function() {
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