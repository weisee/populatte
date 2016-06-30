"use strict";

var _ = require('lodash')
var projection = require('./projection')

module.exports = populations

function populations (refs, path, select) {
    var _populations = []

    // Array of population configs
    if (_.isArray(path)) {
        if (!path.length) return _populations
        return _.map(path, function (p) {
            return populations(refs, p)
        }))

    }

    // Population as config object
    if (_.isObject(path)) {
        return populations(refs, path.path, path.select)
    }

    // Multiple fields population
    // if (typeof path === 'string' && path.indexOf(' ') !== -1) {
    //     var paths = path.split(' ')

    //     return Promise.all(_.map(paths, function (p) {
    //         return populations(refs, p)
    //     }))
    //     .then(function (res) {
    //         if (_.isArray(res[0])) {
    //             _.each(paths, function (p, pidx) {
    //                 _.each(res[0], function (r, ridx) {
    //                     set(res[0][ridx], res[pidx][ridx], p)
    //                 })
    //             })
    //         } else {
    //             _.each(paths, function (p, pidx) {
    //                 set(res[0], res[pidx], p)
    //             })
    //         }
    //         return res[0]
    //     })
    // }

    // Single field population
    if (typeof path === 'string') {
        var ref = refs[path]

        if (!ref) return _populations

        _populations.push({
            path: path,
            select: projection(select, path),
            origin: ref.origin || refs.__default__.origin,
            collection: ref.collection,
            query: ref.query,
        })

        return _populations
    }
}
