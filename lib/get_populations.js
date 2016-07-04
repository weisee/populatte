"use strict";

var _ = require('lodash')
var getProjection = require('./get_projection')

var _treePopulationName = '__population__'

module.exports = getPopulations

function getPopulations (refs, path, select) {
    var populations = _getPopulations(refs, path, select)
    var populationTree = _createPopulationTree(populations)

    _.each(populations, _.bind(_setLevel, this, populationTree))

    return populations
}

function _setLevel (tree, population) {
    var path = population.path
    var pathParts = path.split('.')
    population.level = -1

    _.each(pathParts, function (pathPart, index) {
        var tempPath = pathParts.slice(0, index + 1).join('.')
        var leaf = _.get(tree, tempPath)
        if (leaf && leaf[_treePopulationName]) {
            population.level++
        }
    })
}

function _createPopulationTree (populations) {
    return _.reduce(populations, function (tree, population) {
        var leaf = _.get(tree, population.path)
        var _populationLeaf = {}
        _populationLeaf[_treePopulationName] = true

        if (!leaf) {
            _.set(tree, population.path, _populationLeaf)
        } else {
            _.extend(leaf, _populationLeaf)
        }

        return tree
    }, {})
}

function _getPopulations (refs, path, select) {
    var _populations = []

    // Array of population configs
    if (_.isArray(path)) {
        if (!path.length) return _populations

        return _.reduce(path, function (result, p) {
            return _.union(result, _getPopulations(refs, p, select))
        }, _populations)
    }

    // Population as config object
    if (_.isObject(path)) {
        return _getPopulations(refs, path.path, path.select)
    }

    // Multiple fields population
    if (typeof path === 'string' && path.indexOf(' ') !== -1) {
        var paths = path.split(' ')

        return _.reduce(paths, function (result, p) {
            return _.union(result, _getPopulations(refs, p, select))
        }, _populations)
    }

    // Single field population
    if (typeof path === 'string') {
        var ref = refs[path]
        var projection

        if (!ref) {
            return _populations
        }

        if (select) {
            projection = getProjection(select, path)
        } else {
            projection = getProjection(ref.select)
        }

        _populations.push({
            path: path,
            select: projection,
            origin: ref.origin,
            collection: ref.collection,
            query: ref.query || {},
            key: ref.key,
            level: 0,
        })

        return _populations
    }
}
