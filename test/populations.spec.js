"use strict";

var populations = require('../lib/populations')
var assert = require('assert')

describe('populations fn', function () {

    it('return populations array for path and select', function () {
        var refs = {
            a: {origin: 'mongodb', collection: 'collection', query: {b: 1}}
        }
        assert.deepEqual(populations(refs, 'a', 'a.b'), [
            {
                path: 'a',
                select: {b:1},
                origin: 'mongodb',
                collection: 'collection',
                query: {b:1},
            }
        ])
    })

    it('return populations array for population object', function () {
        var refs = {
            a: {origin: 'mongodb', collection: 'collection', query: {b: 1}}
        }
        assert.deepEqual(populations(refs, {
            path:'a',
            select:'a.b'
        }), [
            {
                path: 'a',
                select: {b:1},
                origin: 'mongodb',
                collection: 'collection',
                query: {b:1},
            }
        ])
    })

})