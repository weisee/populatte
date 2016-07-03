"use strict"

var _ = require('lodash')
var populate = require('./populate')

module.exports = Populatte

Populatte.populators = require('./populators')

function Populatte (populators, options) {
    this.populators = {}
    this.options = options || {}

    if (_.isObject(populators)) {
        this.populators = populators
    }

    if (!_.isFunction(this.populators['default'])) {
        this.populators['default'] = Populatte.populators['default']
    }
}

Populatte.prototype.populate = function (refs, doc, path, select) {
    return populate(this, refs, doc, path, select)
}

