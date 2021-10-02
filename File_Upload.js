const express = require('express');
const path = require('path');
const cors = require('cors');
const multer = require('multer');

var app = express();
var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now())
    }
});
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, 'uploads');
//     },
//     filename: (req, file, cb) => {
//         console.log(file);
//         cb(null, path.extname(file.originalname));
//     }
// })
var upload = multer({ storage: storage });


app.use(express.static('public'));
// app.use(express.json());
app.use(cors({ origin: true }));

app.get("/", (req, res) => {
    console.log("/");
    res.send("Server Side File Service");
});
app.post('/upload', upload.single('myFile'), (req, res, next) => {
    console.log("/uploadfile");
    const file = req.file
    if (!file) {
        const error = new Error('Please upload a file')
        error.httpStatusCode = 400
        return next(error)
    }
    res.send(file)

});
// app.post("/upload", upload.single('image'), (req, res) => {
//     console.log("/upload");
//     res.send("Uploaded");
// });



app.listen(5500, function() {
    console.log("Welcome to File Service Server listen port 5500");
})