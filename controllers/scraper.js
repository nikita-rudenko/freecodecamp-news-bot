const rp = require("request-promise");
const $ = require("cheerio");

const baseUrl = process.env.BASE_URL;

exports.getNews = () => {
  const links = [];

  rp(baseUrl)
    .then((html) => {
      // get all artlcles on the page
      const articles = $(".post-card-title > a", html);

      // 1. extract a link to the full article
      // 2. concat it with the base url
      $(articles).each((i, article) => {
        links.push(`${baseUrl}${$(article).attr("href").substring(6)}`);
      });

      // reverse() for posting in a chronological order
      postLinksToTelegram(links.reverse());
    })
    .catch((err) => {
      console.log(err);
    });
};
