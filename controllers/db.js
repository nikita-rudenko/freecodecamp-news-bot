const dbFile = "./.data/sqlite.db";
const sqlite3 = require("sqlite3").verbose();
const db = new sqlite3.Database(dbFile);

exports.createTable = () => {
  db.run("CREATE TABLE IF NOT EXISTS Links (link TEXT)");
};

exports.insertAll = (links) => {
  const query = links.map((link) => `("${link}")`).join(", ");

  db.serialize(() => {
    db.run(`INSERT INTO Links (link) VALUES ${query}`);
  });
};

exports.getAll = (callback) => {
  db.serialize(() => {
    db.all("SELECT * FROM Links", (err, rows) => {
      if (err != null) {
        console.log(err);
        callback(err);
      }

      return callback(rows);
    });
  });
};

exports.deleteAll = () => {
  db.each("DELETE FROM Links");
};
