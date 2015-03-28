var mongoose = require('mongoose');

var place_model = require('./place');
var person_model = require('./person');

var Person = person_model.Person;
var Place = place_model.Place;

var ThingSchema = new mongoose.Schema ({
    name : String,
    numberOwned: {
        type: Number,
        default: 0
    },
    numberInExistence: {
        type: Number,
        default: 100
    },
    numberInStock: {
        type: Number,
        default: 100
    },
});

ThingSchema.statics.findOneByName = function(name,cb){
    this.findOne({name: name}, cb);
};

var Thing = mongoose.model('Thing', ThingSchema);

module.exports = {
    Thing: Thing
}