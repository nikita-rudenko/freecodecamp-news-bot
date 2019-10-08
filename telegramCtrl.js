const { Telegram } = require("telegraf");

const telegram = new Telegram(process.env.BOT_TOKEN);

exports.postLinksToTelegram = async function(linksArr) {
  for (let i = 0; i < linksArr.length; i++) {
    const text = linksArr[i];

    await telegram.sendMessage(process.env.CHANNEL_ID, text, {
      disable_notification: true
    });
  }
};
