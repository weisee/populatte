"use strict";

var spread = require('../lib/spread')
var assert = require('assert')
var _ = require('lodash')

describe('spread fn', function () {

    it('set top level value', function () {
        var key = 'id'
        var obj = {a: 1}
        var values = _.keyBy([{id: 1}, {id: 2}], key)

        assert.deepEqual(spread(obj, values, 'a', key), { a: {id: 1} })
    })

    it('replace array values', function () {
        var key = 'id'
        var obj = {a: [1,3,2]}
        var values = _.keyBy([{id: 1}, {id: 2}], key)

        assert.deepStrictEqual(spread(obj, values, 'a', key), { a: [
            {id: 1},
            null,
            {id: 2}
        ]})
    })

})