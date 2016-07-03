"use strict";

var getPopulations = require('../lib/get_populations')
var assert = require('assert')

describe('getPopulations fn', function () {

    it('return populations array for path and select strings', function () {
        var refs = {
            a: {origin: 'mongodb', collection: 'collection', key: '_id', query: {b: 1}}
        }
        assert.deepEqual(getPopulations(refs, 'a', 'a.b'), [
            {
                path: 'a',
                select: {b:1},
                key: '_id',
                origin: 'mongodb',
                collection: 'collection',
                query: {b:1},
                level: 0,
            }
        ])
    })

    it('return populations array for population object', function () {
        var refs = {
            a: {origin: 'mongodb', collection: 'collection', key: '_id', query: {b: 1}}
        }
        assert.deepEqual(getPopulations(refs, {
            path:'a',
            select:'a.b'
        }), [
            {
                path: 'a',
                select: {b:1},
                key: '_id',
                origin: 'mongodb',
                collection: 'collection',
                query: {b:1},
                level: 0,
            }
        ])
    })

    it('return populations array for path array', function () {
        var refs = {
            a: {origin: 'mongodb', collection: 'collection', key: '_id', query: {b: 1}},
            b: {origin: 'mssql', collection: 'collection', key: 'id', query: {a: 1}},
        }
        assert.deepEqual(getPopulations(refs, ['a', 'b'], 'a.b'), [
            {
                path: 'a',
                select: {b:1},
                key: '_id',
                origin: 'mongodb',
                collection: 'collection',
                query: {b:1},
                level: 0,
            },
            {
                path: 'b',
                select: {},
                key: 'id',
                origin: 'mssql',
                collection: 'collection',
                query: {a:1},
                level: 0,
            }
        ])
    })

    it('return populations array for some paths in string', function () {
        var refs = {
            a: {origin: 'mongodb', collection: 'collection', key: '_id', query: {b: 1}},
            b: {origin: 'mssql', collection: 'collection', key: 'id', query: {a: 1}},
        }
        assert.deepEqual(getPopulations(refs, 'a b', 'a.b'), [
            {
                path: 'a',
                select: {b:1},
                origin: 'mongodb',
                collection: 'collection',
                key: '_id',
                query: {b:1},
                level: 0,
            },
            {
                path: 'b',
                select: {},
                key: 'id',
                origin: 'mssql',
                collection: 'collection',
                query: {a:1},
                level: 0,
            }
        ])
    })

    it('return populations array with different population levels', function () {
        var refs = {
            a: {origin: 'mongodb', collection: 'collection', key: '_id'},
            'a.b': {origin: 'mongodb', collection: 'collection', key: '_id'},
        }

        assert.deepEqual(getPopulations(refs, 'a.b a'), [
            {
                path: 'a.b',
                select: {},
                key: '_id',
                origin: 'mongodb',
                collection: 'collection',
                query: {},
                level: 1,
            },
            {
                path: 'a',
                select: {},
                origin: 'mongodb',
                collection: 'collection',
                key: '_id',
                query: {},
                level: 0,
            },
        ])
    })

})
