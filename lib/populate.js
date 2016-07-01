"use strict";

var _ = require('lodash')
var Promise = require('bluebird')

var getPopulations = require('./get_populations')
var getPopulator = require('./get_populator')
var spread = require('./spread')
var getIds = require('./get_ids')

module.exports = populate

function populate (refs, doc, path, select) {
    var populations = getPopulations(refs, path, select)
    var levels = []

    _.each(populations, function (population) {
        if (!levels[population.level]) {
            levels[population.level] = [population]
        } else {
            levels[population.level].push(population)
        }
    })

    return Promise.reduce(levels, _populateLevel, doc)
}

function _populateLevel (doc, populations) {
    return Promise.all(_.map(populations, function (population) {
        var populator = getPopulator(population)
        var ids = getIds(doc, population.path)

        return populator(ids, population.select, population.query, {
            key: population.key
        })
        .then(function (result) {
            population.result = _.keyBy(result, population.key)
            return population
        })
    }))
    .then(function (populations) {
        _.each(populations, function (population) {
            spread(doc, population.result, population.path, population.key)
        })

        return doc
    })
}