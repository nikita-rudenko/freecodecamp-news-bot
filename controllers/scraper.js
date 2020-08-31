const rp = require("request-promise");
const $ = require("cheerio");

const { sendErrorByEmail } = require("./mail");
const { postLinksToTelegram } = require("./telegram");

const baseUrl = process.env.BASE_URL;

exports.getNews = async () => {
  const links = [];

  return rp(baseUrl)
    .then(async (html) => {
      // get all artlcles on the page
      const articles = $(".post-card-title > a", html);

      // 1. extract a link to the full article
      // 2. concat it with the base url
      $(articles).each((i, article) => {
        links.push(`${baseUrl}${$(article).attr("href").substring(6)}`);
      });

      // reverse() for posting in a chronological order
      const newPosts = await postLinksToTelegram(links.reverse());
      return newPosts
    })
    .catch(async (err) => {
      await sendErrorByEmail(err)
    });
};
