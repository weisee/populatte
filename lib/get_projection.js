"use strict";

var _ = require('lodash')

module.exports = getProjection

function getProjection (select, path) {
    var projection = {}
    path = path || ''
    var pathLength = path.length

    if (!select) return projection

    if (!pathLength) {
        return _.reduce(select.split(' '), function (projection, p) {
            projection[p] = 1
            return projection
        }, projection)
    }

    _.each(select.split(' '), function (p) {
        if (pathLength && pathLength < p.length && p.slice(0, pathLength) === path) {
            projection[p.substring(pathLength + 1)] = 1
        }
    })

    return projection
}