require("dotenv").config();

const express = require("express");
const bodyParser = require("body-parser");

const { getNews } = require("./controllers/scraper");

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

app.get(process.env.UPDATE_URL, (req, res) => {
  getNews();
  res.send("Updated");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log(
    "Your app is listening on port " +
      `http://localhost:${listener.address().port}`
  );
});
