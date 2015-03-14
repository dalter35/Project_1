var mongoose = require('mongoose');
var models = require('../models/models');
var Person = models.Person;

function connect (cb) {
    mongoose.connect('mongodb://localhost/the_carter');
    mongoose.connection.once('open', function(){
        cb();
    });
} //connect

function disconnect (cb) {
    mongoose.disconnect(function(){
        cb();
    });
} //disconnect

function seed (bucket) {
    var people = [
        {name: 'Brian'},
        {name: 'Dave'},
        {name: 'Sean'}
    ];
    Person.remove({}, function(){
        Person.create(people,bucket);
    });
} //seed

module.exports = {
    connect: connect,
    disconnect: disconnect,
    seed: seed
} //exports