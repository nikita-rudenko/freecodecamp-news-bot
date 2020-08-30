const { MongoClient } = require("mongodb");
const dbName = "bot";
const colName = "links";

let db;

const init = () => {
  MongoClient.connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }).then((client) => {
    db = client.db(dbName);
  });
};

const insertLinks = (links) => {
  const docs = links.reduce((acc, link) => {
    acc.push({ link });
    return acc;
  }, []);

  return db.collection(colName).insertMany(docs);
};

const deleteAllLinks = () => {
  return db.collection(colName).deleteMany({});
};

const getAllLinks = async () => {
  const allLinks = await db.collection(colName).find({}).toArray();

  return allLinks.map(({ link }) => link);
};

module.exports = { init, insertLinks, deleteAllLinks, getAllLinks };
