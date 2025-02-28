import sqlite3 from "sqlite3";
import * as database from "../db/db_functions.js"
const db = new sqlite3.Database("db/blogs.db");
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

const insertUser = `INSERT INTO Users(UserName, UserEmail, CreatedDate) VALUES(?, ?, ?)`;

try {
    await database.execute(db, createUsersTable);
    await database.execute(db, createPostsTable);
    await database.execute(db, createPostDetailsTable);
    await database.execute(db, createCommentsTable);
    await database.execute(db, insertUser, ['Inuwan', 'nongshim12@gmail.com', '2025-02-25']);
} catch (error) {
    console.log(error);
}

db.close((err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log('Database connection closed');
});