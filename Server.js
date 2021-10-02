const express = require('express');
const cors = require('cors');
const fs = require("fs");
const dotenv = require('dotenv');
const { MongoClient } = require("mongodb");
const ObjectId = require('mongodb').ObjectId;
const app = express();
const url =
    "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false&useUnifiedTopology= true";
const client = new MongoClient(url);

const swaggerUi = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");


const swaggerOptions = {
    swaggerDefinition: {
        info: {
            version: "1.0.0",
            title: "Customer API File Service",
            description: "Customer API Information",
            contact: {
                name: "Cjboat Developer"
            },
            servers: ["http://localhost:3001"]
        }
    },
    // ['.routes/*.js']
    apis: ["Server.js"]
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use(express.static('public'));
app.use(cors({ origin: true }));

const multer = require('multer');
dotenv.config();

const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, process.env.uploads_folder);
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + "-" + file.originalname);
    }
});




//Global variable

var upload_muliple = multer({
    storage: storage,
    limits: { fileSize: parseInt(process.env.MaxFileSize, 10) } //for 1KB
});


const path_uploads = __dirname + "/uploads/";



app.set("view engine", "ejs");

app.get("/", (req, res) => {
    console.log("render index.ejs");
    res.render("index");
});


/**
 * @swagger
 *  /uploadfile:
 *      x-swagger-router-controller: "uploadFile"
 *      post:
 *          tags:
 *               - "Upload Files"
 *          summary: "Upload File form User"
 *          operationId: "uploadFile"
 *          consumes:
 *           - multipart/form-data
 *          parameters:
 *          - in: "formData"
 *            name: "myFiles"
 *            required: true
 *            type: file
 *            format: file
 *          responses:
 *              '200':
 *                 description: A successful responses
 */
app.post("/uploadfile", (req, res) => {
    console.log("/uploadfile");
    upload_muliple.array('myFiles', 10)(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
            // A Multer error occurred when uploading.
            res.send(err)
        } else if (err) {
            // An unknown error occurred when uploading.
            res.send(err)
        } else {
            // Everything went fine.
            await InsertDocument_MongoDB(req.files);
            res.send("Uploaded");
        }

    });
});


/**
 * @swagger
 *  /download:
 *      get:
 *          tags:
 *               - "Download File"
 *          summary: "Download File form fileID"
 *          produces:
 *             - "application/json"
 *          parameters:
 *          - name: "id_file"
 *            in: "query"
 *            required: true
 *            type: "string"
 *          responses:
 *              '200':
 *                 description: A successful responses
 */
app.get("/download", async(req, res) => {
    console.log("/download");
    console.log(req.query);
    let result = await Find_Document(req.query.id_file);
    if (result.mimetype == "application/pdf") {
        console.log("result.mimetype == application/pdf");
        fs.readFile(result.pathTodownload, function(err, data) {
            res.contentType("application/pdf");
            res.send(data);
        });
    } else {
        res.download(result.pathTodownload, result.originalname);
    }
});

/**
 * @swagger
 *  /filesizeconfig:
 *      get:
 *          tags:
 *               - "Config file limit size"
 *          summary: "Config limit file size"
 *          produces:
 *             - "application/json"
 *          parameters:
 *          - name: "param"
 *            in: "query"
 *            description: "get limit file size from user"
 *            required: true
 *            type: "integer"
 *            format: "int64"
 *          responses:
 *              '200':
 *                 description: A successful responses
 */
app.get("/filesizeconfig", function(req, res) {
    console.log("/filesizeconfig");
    console.log(req.query);
    if (req.query.param == "") {
        res.send("input text is empty");
    } else {
        let KB_unit = upload_muliple.limits.fileSize / 1024;
        console.log(KB_unit + " KB" + "( old config )");
        let filemaxsize = parseInt(req.query.param);
        upload_muliple.limits.fileSize = filemaxsize * 1024 * 1024; //for MB units
        let MB_unit = upload_muliple.limits.fileSize / (1024 * 1024);
        res.send("Config file size success!! " + "( " + MB_unit + " MB" + " )");
        console.log(MB_unit + " MB" + "( new config )");
    }

});
/**
 * @swagger
 *  /pathconfig:
 *      get:
 *          tags:
 *               - "Config path uploads"
 *          produces:
 *             - "application/json"
 *          parameters:
 *          - name: "param"
 *            in: "query"
 *            description: "get path from user"
 *            required: true
 *            type: "integer"
 *            format: "int64"
 *          responses:
 *              '200':
 *                 description: A successful responses
 */
app.get("/pathconfig", function(req, res) {
    console.log("/pathconfig");
    console.log(req.query);
    if (req.query.param == "") {
        res.send("input text is empty");
    } else {
        res.send("Config path success!!");
    }

});

app.listen(3001, function() {
    console.log("Welcome to File Service Server listen port 3001");
});


async function run() {
    try {
        // Connect the client to the server mongoDB
        await client.connect();
        // Establish and verify connection
        await client.db("test").command({ ping: 1 });
        console.log("Connected successfully to server");
    } finally {
        // Ensures that the client will close when you finish/error
        // await cursor.close();
        // await client.close();
    }
}
run().catch(console.dir);


async function InsertDocument_MongoDB(doc) {
    console.log("async function InsertDocument_MongoDB(doc)");
    var current_date_TH = new Date();
    current_date_TH.setHours(current_date_TH.getHours() + 7);
    for (let i = 0; i < doc.length; i++) {
        delete doc[i]["fieldname"];
        delete doc[i]["destina"];
        doc[i]["path"] = path_uploads;
        doc[i]["timestamp"] = current_date_TH;
    }
    console.log("======================================");
    console.log(doc);
    //Query Collection 
    let collection = client.db("test").collection("test_1");
    await collection.insertMany(doc);


}

async function Find_Document(id_doc) {
    console.log("async function Find_Document(id_doc)");
    let query = { _id: ObjectId(id_doc) };
    //Search document
    let collection = client.db("test").collection("test_1");
    let cursor = collection.find(query);
    let allValues = await cursor.toArray();
    let result = {};
    console.log("===============================");
    console.log(allValues);
    result["pathTodownload"] = allValues[0].path + allValues[0].filename;
    result["originalname"] = allValues[0].originalname;
    result["mimetype"] = allValues[0].mimetype;
    return result;
}