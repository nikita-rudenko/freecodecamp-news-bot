// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
// Telegram API
const { Telegram } = require("telegraf");
// scraping
const rp = require("request-promise");
const $ = require("cheerio");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const telegram = new Telegram(process.env.BOT_TOKEN);
const baseUrl = process.env.BASE_URL;

app.get("/sync", (req, res) => {
  const links = [];

  // TODO: post articles in chronological order
  // TODO: check and post only for fresh articles (consider cron-jobs)

  rp(baseUrl)
    .then(html => {
      const articles = $(".post-card-title > a", html);
      console.log(articles);

      $(articles).each((i, article) => {
        links.push(
          `${baseUrl}${$(article)
            .attr("href")
            .substring(6)}`
        );
      });

      links.map(text => {
        telegram.sendMessage(process.env.CHANNEL_ID, text, {
          disable_notification: true
        });
      });
    })
    .catch(err => {
      console.log(err);
    });

  res.send("Synced");
});

app.use(express.static("public"));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/views/index.html");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
