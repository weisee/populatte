"use strict";

var projection = require('../lib/projection')
var assert = require('assert')

describe('projection fn', function () {

    it('return projection object based on select and path', function () {

        assert.deepEqual(projection('a.b', 'a'), { b: 1 })
    })


})