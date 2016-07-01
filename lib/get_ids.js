"use strict";

var _ = require('lodash')

module.exports = getIds

function getIds (doc, path) {
    var docs = _.isArray(doc) ? doc : [doc]
    var ids = []

    var idsIndex = _.reduce(docs, function (result, doc) {
        return _collectIds(doc, path, result)
    }, {})

    return _.keys(idsIndex)
}


function _collectIds (obj, path, idsIndex) {
    var parts = path.split('.')
    var partsLength = parts.length
    var value = obj

    _.each(parts, function (part, index) {
        value = value[part]

        if (!value) return

        if (index + 1 === partsLength) {
            if (_.isArray(value)) {
                _.each(value, function (v) {
                    idsIndex[v.toString()] = 1
                })
            } else {
                idsIndex[value.toString()] = 1
            }
        } else {
            if (_.isArray(value)) {
                _.each(value, function (v) {
                    _collectIds(v, parts.slice(index + 1).join('.'), idsIndex)
                })
            }
        }
    })

    return idsIndex
}
