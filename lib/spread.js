"use strict";

var _ = require('lodash')

module.exports = spread

function spread (obj, valuesIndex, path, key) {
    if (_.isArray(obj)) {
        return _.map(obj, function (o) {
            return spread(o, valuesIndex, path, key)
        })
    }

    var pathParts = path.split('.')
    var partsLength = pathParts.length
    var value = obj

    _.each(pathParts, function (part, index) {
        value = value[part]
        if (!value) return

        if (index + 1 === partsLength) {
            if (_.isArray(value)) {
                _.each(value, function (v, i) {
                    value[i] = valuesIndex[v.toString()] || null
                })
            } else {
                obj[part] = valuesIndex[value.toString()] || null
            }
        } else {
            if (_.isArray(value)) {
                _.each(value, function (v) {
                    spread(v, pathParts.slice(index + 1).join('.'), valuesIndex, key)
                })
            }
        }
    })

    return obj
}
