var MongoClient = require('mongodb');

const URL='mongodb://localhost:27017/';

class database {
    connect() {
        return new Promise((resolve, reject) => {
            MongoClient.connect(URL,{ useNewUrlParser: true }, (err, db) => {
                if (err) {
                    return reject(err);
                }
                return resolve(db);
            });
        });
    }
}

module.exports = database