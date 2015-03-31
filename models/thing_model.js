var mongoose = require('mongoose');

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

ThingSchema.statics.findOneById = function(id,cb){
    this.findOne({_id: id}, cb);
};

ThingSchema.statics.findAllThings = function(cb){
  this.find({}, cb);  
};

ThingSchema.statics.findAllOwned = function(cb){
    this.find({numberOwned: {$gt:0}}, cb);
};

ThingSchema.statics.findAllUnOwned = function(cb){
    this.find({numberOwned: {$lt:1}}, cb);
};

var Thing = mongoose.model('Thing', ThingSchema);

module.exports = {
    Thing : Thing
}