"use strict";

var _ = require('lodash')

module.exports = projection

function projection (select, path) {
    var projection = {}
    var pathLength = (path || '').length

    if (!select) return projection

    _.each(select.split(' '), function (p) {
        if (pathLength && pathLength < p.length && p.slice(0, pathLength) === path) {
            projection[p.substring(pathLength + 1)] = 1
        }
    })

    return projection
}