"use strict";

var getProjection = require('../lib/get_projection')
var assert = require('assert')

describe('getProjection fn', function () {

    it('return projection object based on select and path', function () {
        assert.deepEqual(getProjection('a.b', 'a'), { b: 1 })
    })


    it('return projection object based on select', function () {
        assert.deepEqual(getProjection('a'), { a: 1 })
    })

})