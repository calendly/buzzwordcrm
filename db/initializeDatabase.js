const db = require('./index');

CREATE_USERS_TABLE_SQL = `
  CREATE TABLE users
    (
      id INTEGER PRIMARY KEY AUTOINCREMENT, 
      calendly_uid TEXT UNIQUE NOT NULL,
      access_token TEXT UNIQUE NOT NULL,
      refresh_token TEXT UNIQUE NOT NULL
    )
`;

module.exports = () => {
    return new Promise((resolve, reject) => {
        db.serialize(function () {
            db.run(CREATE_USERS_TABLE_SQL, (result, err) => {
                if (err) return reject(err);
                resolve(result);
            });
        });
    });
};
