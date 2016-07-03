"use strict";

var assert = require('assert')
var _ = require('lodash')
var Promise = require('bluebird')
var mongodb = require('mongodb')

var mongoURL = 'mongodb://localhost:27017/populatte_test'
var Populatte = require('../lib/populatte'), populatte

var userId, friendId

before(function (done) {
    populatte = new Populatte({}, {mongodb: mongoURL})
    removeUsers()
    .then(function () {
        return addUser({
            name: 'Friend',
        })
    })
    .then(function (_id) {
        friendId = _id
        return addUser({
            name: 'User',
            friends: [friendId]
        })
    })
    .then(function (_id) {
        userId = _id
        done()
    }, done)
})

after(function (done) {
    removeUsers()
    .then(function () { done() }, done)
})

describe('populatte', function () {

    it('populate from mongodb', function (done) {
        var refs = {
            'user': {collection: 'users'}
        }
        var doc = {
            user: friendId
        }
        populatte.populate(refs, doc, 'user')
        .then(function (doc) {
            assert.deepEqual(doc, {
                user: {
                    _id: friendId,
                    name: 'Friend',
                }
            })

            done()
        })
        .then(null, done)
    })

    it('2 level populatte from mongodb', function (done) {
        var refs = {
            'user': {collection: 'users'},
            'user.friends': {collection: 'users'},
        }
        var doc = {
            user: userId
        }
        populatte.populate(refs, doc, 'user.friends user')
        .then(function (doc) {
            assert.deepEqual(doc, {
                user: {
                    _id: userId,
                    name: 'User',
                    friends: [
                        {
                            _id: friendId,
                            name: 'Friend'
                        }
                    ]
                }
            })

            done()
        })
        .then(null, done)
    })
})

function addUser (attrs) {
    return new Promise(function (resolve, reject) {
        mongodb.MongoClient.connect(mongoURL, function (err, db) {
            if (err) return reject(err)
            db.collection('users').insertOne(attrs, function (err, result) {
                if (err) return reject(err)
                db.close()
                resolve(result.insertedId)
            })
        })
    })
}

function removeUsers () {
    return new Promise(function (resolve, reject) {
        mongodb.MongoClient.connect(mongoURL, function (err, db) {
            if (err) return reject(err)
            db.collection('users').remove({}, function (err) {
                if (err) return reject(err)
                db.close()
                resolve()
            })
        })
    })
}
