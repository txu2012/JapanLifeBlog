const express = require("express");
const path = require("path");
const sqlite3 = require("sqlite3");
const database = require("./public/db/db_functions.js");
const { json } = require("stream/consumers");

const app = express();
const web_path = path.join(__dirname, "public");

const createUsersTable = 
    `CREATE TABLE IF NOT EXISTS Users(
        UserId INTEGER PRIMARY KEY AUTOINCREMENT,
        UserName TEXT NOT NULL,
        UserEmail TEXT NOT NULL,
        CreatedDate TEXT,
        UNIQUE(UserName))`;
const createPostsTable = 
    `CREATE TABLE IF NOT EXISTS Posts(
        PostId INTEGER PRIMARY KEY AUTOINCREMENT,
        PostDate TEXT NOT NULL,
        PostTitle TEXT NOT NULL,
        OwnerId INTEGER,
        FOREIGN KEY (OwnerId) REFERENCES Users(UserId))`;
const createPostDetailsTable = 
    `CREATE TABLE IF NOT EXISTS PostDetails(
        PostDetailId INTEGER PRIMARY KEY AUTOINCREMENT,
        PostText TEXT NOT NULL,
        PostId INTEGER,
        FOREIGN KEY (PostId) REFERENCES Posts(PostId))`;
const createCommentsTable = 
    `CREATE TABLE IF NOT EXISTS Comments(
        CommentId INTEGER PRIMARY KEY AUTOINCREMENT,
        Comment TEXT NOT NULL,
        CommentDate TEXT NOT NULL,
        CommenterId INTEGER,
        FOREIGN KEY (CommenterId) REFERENCES Users(UserId))`;

const insertUser = `INSERT INTO Users(UserName, UserEmail, CreatedDate) SELECT ?, ?, ? WHERE NOT EXISTS (SELECT UserName FROM Users WHERE UserName = 'Admin')`;
      
const insert_post = 'INSERT INTO Posts(PostDate, PostTitle, OwnerId) VALUES(?, ?, ?) RETURNING PostId';
const insert_post_details = 'INSERT INTO PostDetails(PostText, PostId) VALUES(?, ?) RETURNING PostDetailId';
const select_all_posts = 
    `SELECT UserId, UserName, PostDate, PostTitle, PostText, a.PostId 
     FROM Posts a, PostDetails b, Users c 
     WHERE a.Postid = b.PostId
     AND a.OwnerId = c.UserId
     AND c.UserId = ?
     ORDER BY a.PostId`;
const select_post = 
    `SELECT UserName, PostDate, PostTitle, PostText, a.PostId 
     FROM Posts a, PostDetails b, Users c 
     WHERE a.PostId = b.PostId
     AND a.OwnerId = c.UserId
     AND c.UserId = ?
     AND a.PostId = ?
     ORDER BY a.PostId`;
    

app.use(express.static(web_path));
console.log(web_path);

app.use(express.json());

// Parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    console.log("Main Page accessed.");
    res.sendFile(path.join(web_path, 'Main.html'));
});

app.post("/api/insert", function (req, res) {
    console.log("Post");
    console.log(req.body); 
    try {
        // Insert Post Header
        database.execute(db, insert_post, [req.body["curDate"], req.body["postTitle"], req.body["userId"]])
            .then((value) => {
                console.log(value);
                // Insert Post Details
                database.execute(db, insert_post_details,[req.body["postBody"], value.row.PostId])
                    .then((value) => console.log(value));
            });
        res.status(201).send(req.body);
    } catch (error) {
        console.log(error);
        res.status(500).send('Error creating post.')
    }

});
app.listen(5500, () => console.log("Server is running on Port 5500"));  

app.get("/api/posts", (req, res) => {
    console.log('Get');
    // Query all posts
    try {
        const userId = req.query.userid || null;
        const postId = req.query.postid || null;
        console.log(userId, postId);
        if (postId === null) {
            console.log("Get All");
            database.execute(db, select_all_posts, [Number(userId)]).then((value) => {
                res.status(201).json(value);
            });
        }
        else {
            console.log("Get Post");
            database.execute(db, select_post, [Number(userId), Number(postId)]).then((value) => {
                res.status(201).json(value);
            });
        }
    } catch (error) {
        console.log(error);
        res.status(500).send('Error querying post.')
    }
});

const db = new sqlite3.Database('public/db/blogs.db', (err) => {
    if (err) {
      // Cannot open database
      console.error(err.message);
      throw err;
    } else {
      
      try {
          database.execute(db, createUsersTable);
          database.execute(db, createPostsTable);
          database.execute(db, createPostDetailsTable);
          database.execute(db, createCommentsTable);
          database.execute(db, insertUser, ['Admin', 'admin@gmail.com', '2025-02-25']);
      } catch (error) {
          console.log(error);
      }
    }
});