const MongoClient = require('mongodb').MongoClient;
const assert = require('assert').strict;
const dboper = require('./operations'); // DB Operations

const url = 'mongodb://localhost:27017/';
const dbname = 'nucampsite';

// TODO review unified topology
MongoClient.connect(url, {useUnifiedTopology: true}, (err, client) => {
    assert.strictEqual(err, null); // similar to error === null

    console.log('Connected correctly to server');

    // Connect to the DB
    const db = client.db(dbname);

    // Delete all documents in the Campsites collection. Starts with a fresh set of data each time.
    db.dropCollection('campsites', (err, result) => {
        assert.strictEqual(err, null);
        console.log('Dropped the collection', result);

        // Return the documents in the collection, in an array.
        dboper.insertDocument(
            db,
            {name: "Breadcrumb Trail Campground", description: "Test"},
            'campsites',
            result => {
                assert.strictEqual(err, null);
                console.log('Insert Document:', result.ops); // ops is a shorthand for "operations". In this case, an array with the document inserted

                dboper.findDocuments(db,
                    'campsites',
                    docs => {
                        console.log('Found Documents:', docs);
                        dboper.updateDocument(db, {name: "Breadcrumb Trail Campground"},
                            {description: "Updated Test Description"}, 'campsites',
                            result => {
                                console.log('Updated Document Count:', result.result.nModified);

                                dboper.findDocuments(db, 'campsites', docs => {
                                    console.log('Found Documents:', docs);

                                    dboper.removeDocument(db, {name: "Breadcrumb Trail Campground"},
                                        'campsites', result => {
                                            console.log('Deleted Document Count:', result.deletedCount);

                                            client.close();
                                        }
                                    );
                                });
                            }
                        );
                    });
            });
    });
});