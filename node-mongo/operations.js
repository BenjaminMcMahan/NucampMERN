/**
 * Insert Document
 * @param db {object}
 * @param document {object}
 * @param collection {string}
 * @returns {*}
 */
exports.insertDocument = (db, document, collection) => {
    const coll = db.collection(collection);
    return coll.insertOne(document);
};

/**
 * Find Documents
 * @param db {object}
 * @param collection {string}
 */
exports.findDocuments = (db, collection) => {
    const coll = db.collection(collection);
    // Return all documents in the collection and return an array
    return coll.find().toArray();
};

/**
 * Remove Document
 * @param db {object}
 * @param document {object}
 * @param collection {string}
 */
exports.removeDocument = (db, document, collection) => {
    const coll = db.collection(collection);
    return coll.deleteOne(document);
};

/**
 * Update Document
 * @param db {object}
 * @param document {object}
 * @param update {object}
 * @param collection {string}
 */
exports.updateDocument = (db, document, update, collection) => {
    const coll = db.collection(collection);
    return coll.updateOne(document, {$set: update}, null);
};