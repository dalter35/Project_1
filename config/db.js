var mongoose = require('mongoose');
var models = require('../models/models');
var Person = models.Person;

function connect (cb) {
    mongoose.connect('mongodb://localhost/the_carter');
    mongoose.connection.once('open', function(){
        cb();
    });
}

function disconnect (cb) {
    mongoose.disconnect(function(){
        cb();
    });
}

module.exports = {
    connect: connect,
    disconnect: disconnect,
    seed: seed
}