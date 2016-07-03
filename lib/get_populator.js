"use strict";

module.exports = getPopulator

function getPopulator (populators, population) {
    populators = populators || {}
    population = population || {}

    return populators[population.origin] || populators['default']
}
