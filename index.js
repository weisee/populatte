'use strict';

var populate = require('./lib/populate')
var populations = require('./lib/populations')
var populators = require('./lib/populators')

var _populators = {}

module.exports = {
    init: function () {
        init.apply(this, arguments)
        .then(function (options) {
            populators = options.populators
        })
    },
    populate: function () {
    }
}
