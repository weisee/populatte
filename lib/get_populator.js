"use strict";

var _ = require('lodash')
var populators = require('./populators')
module.exports = getPopulator

function getPopulator (population) {
    population = population || {}
    var populator = populators[population.origin] || populators['default']

    return populator
}