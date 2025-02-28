const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const database = require("./db_functions.js");
const { json } = require("stream/consumers");
const fs = require('fs');
const {Create, Insert, Select} = require("./sql.json")

const app = express();
const web_path = path.join(__dirname, "..");   

app.use(express.static(web_path));
console.log(web_path);

app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log("Main Page accessed.");
    res.sendFile(path.join(web_path, 'web/User.html'));
});

app.post("/api/insert", function (req, res) {
    console.log("POST Request");
    try {
        var d = new Date();
        let curDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();
        // Insert Post Header
        database.execute(db, Insert["InsertPost"], [curDate, req.body["postTitle"], req.body["userId"]])
            .then((value) => {
                // Insert Post Details
                database.execute(db, Insert["InsertPostDetails"],[req.body["postBody"], value.row.PostId]);
            });
        res.status(201).send(req.body);
    } 
    catch (error) {
        console.log(error);
        res.status(500).send('Error creating post.')
    }

});

app.post("/api/image/save", function (req, res) {
    console.log("POST Request Image");
    try {
        console.log(req.body["dataurl"])
        dataUrlToFile(req.body["dataurl"], "Image1");
        res.status(201).send('Success in saving.')
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error saving image.')
    }
});

app.listen(5500, () => console.log("Server is running on Port 5500: http://localhost:5500/"));  

app.get("/api/posts", (req, res) => {
    console.log('GET Request');
    // Query all posts
    try {
        const userId = req.query.userid || null;
        const postId = req.query.postid || null;
        if (postId === null) {
            database.execute(db, Select["SelectAllPosts"], [Number(userId)]).then((value) => {
                res.status(201).json(value);
            });
        }
        else {
            database.execute(db, Select["SelectPost"], [Number(userId), Number(postId)]).then((value) => {
                res.status(201).json(value);
            });
        }
    } 
    catch (error) {
        console.log(error);
        res.status(500).send('Error querying post.')
    }
});

const db = new sqlite3.Database('public/db/blogs.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err;
    } 
    else {  
      try {
          database.execute(db, Create["CreateUsersTable"]);
          database.execute(db, Create["CreatePostsTable"]);
          database.execute(db, Create["CreatePostDetailsTable"]);
          database.execute(db, Create["CreateCommentsTable"]);
          database.execute(db, Insert["InsertUser"], ['Admin', 'admin@gmail.com', '2025-02-25', 'Admin']);
      } 
      catch (error) {
          console.log(error);
      }
    }
});

function dataUrlToFile(dataurl, filename) {
    const regex = /^data:.+\/(.+);base64,(.*)$/;
    const matches = dataurl.match(regex);
    const ext = matches[1];
    const data = matches[2];
    const buffer = new Buffer(data, 'base64');
    const image_path = path.join(web_path, 'images/');
    const outputFilepath = image_path + filename + '.' + ext;
    fs.writeFileSync(outputFilepath, buffer);
    console.log(`*** Image wrote
    From dataURI: "${dataurl}" 
    To file => "${outputFilepath}"`);
}