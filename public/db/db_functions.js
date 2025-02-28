import sqlite3 from "sqlite3";

export const execute = async (db, sql, params = []) => {
    if (params && params.length > 0) {
        return new Promise((resolve, reject) => {
            if (sql.split(' ')[0] == 'SELECT') {
                db.all(sql, params, function (err, rows) {
                    if (err) reject(err);
                    console.log(`${sql.split(" ")[0]} SQL executed successfully.`)
                    resolve(rows);
                });
            }
            else {
                db.get(sql, params, function (err, row) {
                    if (err) reject(err);
                    console.log(`${sql.split(" ")[0]} SQL executed successfully.`)
                    resolve({row});
                });
            }
        });
    }
    return new Promise((resolve, reject) => {
        db.exec(sql, (err) => {
            if (err)  {
                console.log(err.message);
                reject(err);
            }
            // console.log('Successfully created table.');
            resolve();
        });
    });
};