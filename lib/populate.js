"use strict";

var _ = require('lodash')
var Promise = require('bluebird')

var getPopulations = require('./get_populations')
var getPopulator = require('./get_populator')
var spread = require('./spread')
var getIds = require('./get_ids')

module.exports = populate

function populate (env, refs, doc, path, select) {
    var populations = getPopulations(refs, path, select)
    var levels = []

    _.each(populations, function (population) {
        if (!levels[population.level]) {
            levels[population.level] = [population]
        } else {
            levels[population.level].push(population)
        }
    })

    return Promise.reduce(levels, _populateLevel.bind(this, env), doc)
}

function _populateLevel (env, doc, populations) {
    return Promise.all(_.map(populations, function (population) {
        var populator = getPopulator(env.populators, population)
        var ids = getIds(doc, population.path)

        return populator(ids, population.select, population.query, {
            key: population.key,
            collection: population.collection,
            options: env.options[populator.id]
        })
        .then(function (result) {
            population.result = result
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
