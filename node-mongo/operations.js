const assert = require('assert').strict;

/**
 * Insert Document
 * @param db {object}
 * @param document {object}
 * @param collection {string}
 * @param callback {function}
 */
exports.insertDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    coll.insertOne(document, (err, result) => {
        assert.strictEqual(err, null);
        callback(result);
    });
};

/**
 * Find Documents
 * @param db {object}
 * @param collection {string}
 * @param callback {function}
 */
exports.findDocuments = (db, collection, callback) => {
    const coll = db.collection(collection);
    // Return all documents in the collection and return an array
    coll.find().toArray((err, docs) => {
        assert.strictEqual(err, null);
        callback(docs);
    });
};

/**
 * Remove Document
 * @param db {object}
 * @param document {object}
 * @param collection {string}
 * @param callback {function}
 */
exports.removeDocument = (db, document, collection, callback) => {
    const coll = db.collection(collection);
    coll.deleteOne(document, (err, result) => {
        assert.strictEqual(err, null);
        callback(result);
    });
};

/**
 * Update Document
 * @param db {object}
 * @param document {object}
 * @param update {object}
 * @param collection {string}
 * @param callback {function}
 */
exports.updateDocument = (db, document, update, collection, callback) => {
    const coll = db.collection(collection);
    coll.updateOne(document, {$set: update}, null, (err, result) => {
        assert.strictEqual(err, null);
        callback(result);
    })
};