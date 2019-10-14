const fs = require("fs");

const dbCtrl = require("./dbCtrl");

const { Telegram } = require("telegraf");
const telegram = new Telegram(process.env.BOT_TOKEN);

exports.postLinksToTelegram = linksArr =>
  dbCtrl.getAll(async rowsFromDB => {
    // get snapshot array from DB
    const linksFromDB = await rowsFromDB.map(row => row.link);

    // compare new array and snapshot array from DB
    const freshLinks = await linksArr.filter(
      link => !linksFromDB.includes(link)
    );

    if (!freshLinks) return;

    // post fresh links in chronological order
    for (let i = 0; i < freshLinks.length; i++) {
      const text = freshLinks[i];

      await telegram.sendMessage(process.env.CHANNEL_ID, text, {
        disable_notification: true
      });
    }

    // reset snapshot
    dbCtrl.deleteAll();
    // insert new snapshot
    dbCtrl.insertAll(linksArr);
  });
