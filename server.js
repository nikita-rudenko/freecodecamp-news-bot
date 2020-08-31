require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const { getNews } = require("./controllers/scraper");
const db = require('./controllers/db')

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

db.init()

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get(process.env.UPDATE_URL, async (req, res) => {
  const newPosts = await getNews();
  res.json({ newPosts });
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(
    "Your app is listening on port " +
      `http://localhost:${listener.address().port}`
  );
});
