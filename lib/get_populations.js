"use strict";

var _ = require('lodash')
var getProjection = require('./get_projection')

module.exports = getPopulations

function getPopulations (refs, path, select) {
    var populations = _getPopulations(refs, path, select)
    console.log('getPopulations', path)
    _.each(populations, function (population) {
        console.log('PATH', population.path)
    })

    return populations
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

        if (!ref) return _populations

        _populations.push({
            path: path,
            select: getProjection(select, path),
            origin: ref.origin || refs.__default__.origin,
            collection: ref.collection,
            query: ref.query || {},
            key: ref.key || refs.__default__.key,
            level: 0,
        })

        return _populations
    }
}
