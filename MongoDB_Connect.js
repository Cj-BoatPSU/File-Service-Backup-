const { MongoClient } = require("mongodb");

// Connection URI
const uri =
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false&useUnifiedTopology= true";

// Create a new MongoClient
const client = new MongoClient(uri);

async function run() {
    const query = {};
    const options = {
        // sort in descending (-1) order by rating
        sort: { rating: -1 },
        // omit the first two documents
        skip: 2,
    }
    try {
        // Connect the client to the server
        await client.connect();
        // Establish and verify connection
        await client.db("test").command({ ping: 1 });
        console.log("Connected successfully to server");
        //Query Collection 
        let collection = client.db("test").collection("test_1");
        await Insert_Document(collection);
        const cursor = collection.find(query);
        //console.log each document
        await cursor.forEach(doc => console.log(doc));
        // await console.log("======================");
        // await cursor.forEach(console.dir);

    } finally {
        // Ensures that the client will close when you finish/error
        // await cursor.close();
        await client.close();
    }
}
run().catch(console.dir);

async function Insert_Document(collection) {
    var current_date_TH = new Date();
    current_date_TH.setHours(current_date_TH.getHours() + 7);
    const NewDocument = {
        name: "test1",
        value: "hgfhg",
        timestamp: current_date_TH,
    };
    const result = await collection.insertOne(NewDocument);
    console.dir(result.insertedCount); // should print 1 on successful insert

    const NewDocument_Array = [
        { "_id": 2, "name": "Les Misérables", "author": "Hugo", "length": 1462 },
        { "_id": 3, "name": "Atlas Shrugged", "author": "Rand", "length": 1088 },
        { "_id": 4, "name": "Infinite Jest", "author": "Wallace", "length": 1104 },
        { "_id": 5, "name": "Cryptonomicon", "author": "Stephenson", "length": 918 },
        { "_id": 6, "name": "A Dance with Dragons", "author": "Martin", "length": 1104 },

    ];
    // const resultMany = await await collection.insertMany(NewDocument_Array);
    // console.dir(resultMany.insertedCount); // should print 1 on successful insert
}