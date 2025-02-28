const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const database = require("./db_functions.js");
const { json } = require("stream/consumers");
const fs = require('fs');
const SQL = require("./sql.json")

const app = express();
const web_path = path.join(__dirname, "..");   

app.use(express.static(web_path));
console.log(web_path);

app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.listen(5500, () => console.log('Server is running on Port 5500: http://localhost:5500/'));  

app.get('/', (req, res) => {
    console.log('User Page accessed.');
    res.sendFile(path.join(web_path, 'web/User.html'));
});

app.post('/api/user', (req, res) => {
    console.log('POST Request');
    // Query User
    try {
        if (req.body['commands'].length > 0) {
            const cmds = req.body['commands'];
            database.execute(db, SQL[cmds[0].sql], cmds[0].params[0])
                .then((value) => {
                    if (value.length > 0) {
                        if (value[0]['Password'] === cmds[0].params[1]) {
                            res.status(201).json({message:"SUCCESS"});
                        }
                        else {
                            res.status(500).json({message:"Wrong username/password."});
                        }
                    }
                    else {
                        res.status(500).json({message:"No user found."});
                    }
                });
        }
    }
    catch (err) {
        console.log(err);
        res.status(500).send('Error querying user.')
    }
});

app.get('/api/posts', (req, res) => {
    console.log('GET Request');
    // Query all posts
    try {
        const query = req.query.q || null;
        console.log(query);
        const userId = req.query.userid || null;
        const postId = req.query.postid || null;
        const params = [...(userId ? [userId] : []), ...(postId ? [postId] : [])]
        console.log(params);
        if (query !== null) {
            database.execute(db, SQL[query], params).then((value) => {
                res.status(201).json({message:"SUCCESS", posts: value});
            });
        }
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message:"Error grabbing post"})
    }
});

app.post("/api/insert", function (req, res) {
    console.log("POST Request");
    try {
        var d = new Date();
        let curDate = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate();

        if (req.body['commands'].length > 0) {
            const cmds = req.body['commands'];
            console.log('Command received.', cmds);
            database.execute(db, SQL[cmds[0].sql], [curDate, ...cmds[0].params])
                .then((value) => {
                    if (cmds.length > 1) {
                        database.execute(db, SQL[cmds[1].sql],[...cmds[1].params, value.row.PostId]);
                    }
                });
            res.status(201).json({message:"SUCCESS"});
        }
        else{
            res.status (500).json({message:"Command Failed."});
        }
    } 
    catch (error) {
        console.log(error);
        res.status(500).json({message:"Error Creating Post"});
    }
});

app.post('/api/image/save', function (req, res) {
    console.log('POST Request Image');
    try {
        console.log(req.body['dataurl'])
        dataUrlToFile(req.body['dataurl'], 'Image1');
        res.status(201).json({message:"SUCCESS"})
    }
    catch (err) {
        console.log(err);
        res.status(500).json({message:"Error Saving Image"})
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
          database.execute(db, SQL['CreateUsersTable']);
          database.execute(db, SQL['CreatePostsTable']);
          database.execute(db, SQL['CreatePostDetailsTable']);
          database.execute(db, SQL['CreateCommentsTable']);
          database.execute(db, SQL['InsertUser'], ['2025-02-25', 'Admin', 'admin@gmail.com', 'admin', 'Admin']);
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