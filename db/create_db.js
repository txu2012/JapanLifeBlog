import sqlite3 from "sqlite3";

const execute = async (db, sql) => {
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err)  {
                console.log(err.message);
                reject(err);
            }
            console.log('Successfully created table.');
            resolve();
        });
    });
};

const db = new sqlite3.Database("db/blogs.db");
//const createDb = "CREATE DATABASE blog";
const createUsersTable = 
    `CREATE TABLE IF NOT EXISTS Users(
        UserId INTEGER PRIMARY KEY AUTOINCREMENT,
        UserName TEXT NOT NULL,
        UserEmail TEXT NOT NULL,
        CreatedDate TEXT)`;
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

// db.run(createUsersTable, (err) => {
//     if (err) {
//         return console.error('Error creating users table:', err.message);
//     }
//     console.log('Table created successfully');
// });
// db.run(createPostsTable, (err) => {
//     if (err) {
//         return console.error('Error creating posts table:', err.message);
//     }
//     console.log('Table created successfully');
// });
// db.run(createPostDetailsTable, (err) => {
//     if (err) {
//         return console.error('Error creating postdetails table:', err.message);
//     }
//     console.log('Table created successfully');
// });
// db.run(createCommentsTable, (err) => {
//     if (err) {
//         return console.error('Error creating comments table:', err.message);
//     }
//     console.log('Table created successfully');
// });

try {
    await execute(db, createUsersTable);
    await execute(db, createPostsTable);
    await execute(db, createPostDetailsTable);
    await execute(db, createCommentsTable);
} catch (error) {
    console.log(error);
}

db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection closed');
});
// con.connect(function(err) {
//     if (err) throw err;
//     console.log("Connected!");

//     con.query(createDb, (err, result) => {
//         if (err) throw err;
//         console.log("Database created.")
//     });

//     con.query(createUsersTable, (err, result) => {
//         if (err) throw err;
//         console.log("Users table created.")
//     });

//     con.query(createPostsTable, (err, result) => {
//         if (err) throw err;
//         console.log("Posts table created.")
//     });

//     con.query(createPostDetailsTable, (err, result) => {
//         if (err) throw err;
//         console.log("PostDetails table created.")
//     });

//     con.query(createCommentsTable, (err, result) => {
//         if (err) throw err;
//         console.log("Comments table created.")
//     });
// });