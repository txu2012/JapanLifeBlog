import sqlite3 from "sqlite3";

export const execute = async (db, sql) => {
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