// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");
// scraping
const rp = require("request-promise");
const $ = require("cheerio");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const { postLinksToTelegram } = require("./telegramCtrl");

const baseUrl = process.env.BASE_URL;

app.get("/sync", (req, res) => {
  const links = [];

  // TODO: check and post only fresh articles (consider cron-jobs)
  rp(baseUrl)
    .then(html => {
      const articles = $(".post-card-title > a", html);

      $(articles).each((i, article) => {
        links.push(
          `${baseUrl}${$(article)
            .attr("href")
            .substring(6)}`
        );
      });

      postLinksToTelegram(links.reverse());
    })
    .catch(err => {
      console.log(err);
    });

  res.send("Synced");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
