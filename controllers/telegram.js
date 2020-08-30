const db = require("./db");

const { Telegram } = require("telegraf");
const telegram = new Telegram(process.env.BOT_TOKEN);

exports.postLinksToTelegram = async (scrapedLinks) => {
  const savedLinks = await db.getAllLinks();

  const freshLinks = scrapedLinks.filter((link) => !savedLinks.includes(link));

  if (freshLinks.length === 0) return;

  // post fresh links in chronological order
  for (let i = 0; i < freshLinks.length; i++) {
    const text = freshLinks[i];
    await telegram.sendMessage(process.env.CHANNEL_ID, text, {
      disable_notification: true,
    });
  }

  // reset snapshot
  await db.deleteAllLinks();
  // insert new snapshot
  await db.insertLinks(freshLinks);
};
