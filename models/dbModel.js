const db = require('../config/db');

const query = (sql, values) => {
    return new Promise((resolve, reject) => {
        db.query(sql, values, (err, result) => {
            if (err) return reject(err);
            resolve(result);
        });
    });
};

module.exports = query;
