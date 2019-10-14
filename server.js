// server.js
// where your node app starts

// init project
const express = require("express");
const bodyParser = require("body-parser");

// import tools for scraping
const rp = require("request-promise");
const $ = require("cheerio");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Telegram controller
const { postLinksToTelegram } = require("./telegramCtrl");

const baseUrl = process.env.BASE_URL;

app.get(process.env.UPDATE_URL, (req, res) => {
  const links = [];

  rp(baseUrl)
    .then(html => {
      // get all artlcles on the page
      const articles = $(".post-card-title > a", html);
      
      // 1. extract a link to the full article
      // 2. concat it with the base url
      $(articles).each((i, article) => {
        links.push(
          `${baseUrl}${$(article)
            .attr("href")
            .substring(6)}`
        );
      });

      // reverse() for posting in a chronological order
      postLinksToTelegram(links.reverse());
    })
    .catch(err => {
      console.log(err);
    });

  res.send("Updated");
});

// listen for requests :)
const listener = app.listen(process.env.PORT, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
