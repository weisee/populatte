"use strict";

var assert = require('assert')
var _ = require('lodash')

var populate = require('../lib/populate')
var populators = require('../lib/populators')

var collection = [
    {id: 1},
    {id: 2},
    {id: 3},
    {id: 4},
]

localPopulator.id = 'local'
function localPopulator (ids, projection, query, options) {
    var ids = _.map(ids, Number)
    var key = options.key || '_id'

    return Promise.resolve(_.filter(collection, function (doc) {
        return !!~ids.indexOf(doc[key])
    }))
    .then(function (result) {
        return _.keyBy(result, key)
    })
}

var env = {
    populators: {
        local: localPopulator
    },
    options: {},
}

describe('populate fn', function () {

    it('return populated by one path object', function (done) {
        var refs = {
            a: {origin: 'local', collection: 'collection', key: 'id', query: {b: 1}}
        }
        var object = {
            a: 1,
        }

        populate(env, refs, object, 'a', 'a.b')
        .then(function (populatedObject) {
            assert.deepEqual(populatedObject, {
                a: { id: 1 }
            })
        })
        .then(function () { done() }, done)
    })

    it('return populated by one path objects array', function (done) {
        var refs = {
            a: {origin: 'local', collection: 'collection', key: 'id', query: {b: 1}}
        }
        var objects = [
            {a: 1}, {a: 10}, {a: 1},
        ]

        populate(env, refs, objects, 'a')
        .then(function (result) {
            assert.deepEqual(result, [
                {a: { id: 1 }},
                {a: null},
                {a: { id: 1 }},
            ])
        })
        .then(function () { done() }, done)
    })
})
