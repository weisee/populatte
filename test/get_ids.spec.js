"use strict";

var getIds = require('../lib/get_ids')
var assert = require('assert')

describe('getIds fn', function () {

    it('take ids from object on top level', function () {
        var obj = {a:1, b:2}
        assert.deepEqual(getIds(obj, 'a'), ['1'])
    })

    it('take ids from object on deep level', function () {
        var obj = {a:{b:{c: 1}}}
        assert.deepEqual(getIds(obj, 'a.b.c'), ['1'])
    })

    it('take ids from objects array on top level', function () {
        var objs = [
            {a:1, b:2},
            {a:2, b:2},
            {a:3, b:2},
        ]
        assert.deepEqual(getIds(objs, 'a'), ['1', '2', '3'])
    })

    it('take ids from objects array on deep level', function () {
        var objs = [
            {a:{b:{c:1}}, b:2},
            {a:{b:{c:2}}, b:2},
            {a:{b:{c:3}}, b:2},
        ]
        assert.deepEqual(getIds(objs, 'a.b.c'), ['1', '2', '3'])
    })

    it('take ids from object array field on top level', function () {
        var obj = {a:[1, 3], b:2}
        assert.deepEqual(getIds(obj, 'a'), ['1', '3'])
    })

    it('take ids from objects array on deep level', function () {
        var objs = [
            {a:{b:{c:[1, 2, 3]}}, b:2},
            {a:{b:{c:[3, 4, 5]}}, b:2},
            {a:{b:{c:[5, 3, 1]}}, b:2},
        ]
        assert.deepEqual(getIds(objs, 'a.b.c'), ['1', '2', '3', '4', '5'])
    })

    it('take ids from objects array on deep level with array', function () {
        var objs = [
            {a:{b:{c:[{d: 1}, {d: 2}, {d: 3}]}}, b:2},
            {a:{b:{c:[{d: 3}, {d: 4}, {d: 5}]}}, b:2},
            {a:{b:{c:[{d: 5}, {d: 3}, {d: 1}]}}, b:2},
        ]
        assert.deepEqual(getIds(objs, 'a.b.c.d'), ['1', '2', '3', '4', '5'])
    })

})