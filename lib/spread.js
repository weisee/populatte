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

        value = _.get(value, part)

        if (!value) return

        if (index + 1 === partsLength) {
            if (_.isArray(value)) {
                _.each(value, function (v, i) {
                    if (v) {
                        value[i] = valuesIndex[String(v)] || null
                    }
                })
            } else {
                _.set(obj, path, valuesIndex[String(value)] || null)
            }
        } else {
            if (_.isArray(value)) {
                _.each(value, function (v) {
                    spread(v, valuesIndex, pathParts.slice(index + 1).join('.'), key)
                })
            }
        }
    })

    return obj
}
