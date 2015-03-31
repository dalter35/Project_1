var mongoose = require('mongoose');

var PlaceSchema = new mongoose.Schema ({
    name: String,
    numberOfTimesFavorited: {
        type: Number,
        default: 0
    }
});

PlaceSchema.statics.getOneByName = function(name,cb){
    this.findOne({name:name}, cb);
    
    // this.findOne({name:name}, function(err, _foundPlace){
    //     cb(err, _foundPlace)
    // });
};

PlaceSchema.statics.getOneById = function(id, cb){
    this.findOne({_id: id}, function(err, _placeID){
        cb(err, _placeID)
    })   
};

PlaceSchema.statics.getAll = function(cb){
    this.find({}, function(err, _returnedPlaces){
        cb(err, _returnedPlaces)
    })
};

PlaceSchema.statics.getAllFavorited = function(cb){
    this.find({numberOfTimesFavorited: {$gt: 0}}, function(err, _returnedFavorites){
        cb(err, _returnedFavorites);
    })
};

PlaceSchema.statics.getAllUnFavorited = function(cb){
    this.find({numberOfTimesFavorited: {$lt: 1}}, function(err, _returnedUnFavorites){
        cb(err, _returnedUnFavorites);
    })
};

var Place = mongoose.model('Place', PlaceSchema);


module.exports = {
    Place : Place
}