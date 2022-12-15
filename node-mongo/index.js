const MongoClient = require('mongodb').MongoClient;
const assert = require('assert').strict;

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

        // Recreate the collection
        const collection = db.collection('campsites');

        // Return the documents in the collection, in an array.
        collection.insertOne({name: "Breadcrumb Trail Campground", description: "Test"}, (err, result) => {
            assert.strictEqual(err, null);
            console.log('Insert Document:', result.ops); // ops is a shorthand for "operations". In this case, an array with the document inserted

            collection.find().toArray((err, docs) => {
                assert.strictEqual(err, null);
                console.log('Found Documents', docs);

                client.close(); // Close the connection to the server
            });
        });
    })
});