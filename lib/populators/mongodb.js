"use strict";

var _ = require('lodash')
var Promise = require('bluebird')
var mongodb = require('mongodb')
var connect = Promise.promisify(mongodb.MongoClient.connect)
var ObjectID = mongodb.ObjectID
var _connections = {}

module.exports = populator

populator.id = 'mongodb'

function populator (ids, projection, query, options) {
    options = options || {}

    return _createConnection(options.options)
    .then(function (db) {
        return new Promise(function (resolve, reject) {
            var criteria = {}
            var key = options.key || '_id'

            if (key === '_id') {
                ids = _.map(ids, function (_id) {
                    return new ObjectID(_id)
                })
            }

            criteria[key] = {$in: ids}

            return db.collection(options.collection)
            .find(_.extend({}, query, criteria))
            .project(projection)
            .toArray(function (err, result) {
                if (err) {
                    return reject(err)
                }

                resolve(_.keyBy(result, function (i) {
                    return i[key].toString()
                }))
            })
        })
    })
}

function _createConnection (url) {
    if (_connections[url]) {
        return Promise.resolve(_connections[url])
    }

    return connect(url).then(function (db) {
        return _connections[url] = db
    })
}
