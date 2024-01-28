module.exports.config = {
  name: "hi",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Sam",
  description: "hi gửi sticker",
  commandCategory: "QTV BOX",
  usages: "[]",
  cooldowns: 5,
  usePrefix: true
}

module.exports.handleEvent = async ({ event, api, Users }) => {
  let KEY = [
    "hello",
    "hi",
    "hello po",
    "hi po",
    "hiii",
    "helloo",
    "loe",
    "low",
    "lo",
    "hey",
    "heyy",
    "loe po",
    "low po",
    "hai",
    "chào",
    "chao",
    "hí",
    "híí",
    "hì",
    "hìì",
    "lô",
    "helo",
    "hê nhô",
    "yo",
    "wazzup",
    "wassup",
    "hey",
    "hey you",
    "hola"
  ];

  const aa = event.body ? event.body.toLowerCase() : "";

  const thread = global.data.threadData.get(event.threadID) || {};
  if (typeof thread["hi"] == "undefined", thread["hi"] == false) return;
  else {
    if (KEY.includes(aa) !== false) {
      const data = [
        "184002922217363", "184023658881956", "184003212217334", "184002655550723", "184003438883978", "2379545595403511", "1926234657415528", "4046655705381617", "4046877352026119", "4046884992025355", "4070816262965561"
      ];

      api.setMessageReaction("💗", event.messageID, (err) => { }, true);

      api.sendTypingIndicator(event.threadID, true);

      const sticker = data[Math.floor(Math.random() * data.length)];
      const unknownits = ["zupp", "kumusta", "hello", "hi"];
      const itsunknown = unknownits[Math.floor(Math.random() * unknownits.length)];

      const moment = require("moment-timezone");
      const hours = moment.tz('Asia/Manila').format('HHmm');
      const session = (
        hours > 0001 && hours <= 400 ? "bright morning" :
          hours > 401 && hours <= 700 ? "morning" :
            hours > 701 && hours <= 1000 ? "morning" :
              hours > 1001 && hours <= 1100 ? "afternoon" :
                hours > 1100 && hours <= 1500 ? "afternoon" :
                  hours > 1501 && hours <= 1800 ? "evening" :
                    hours > 1801 && hours <= 2100 ? "evening" :
                      hours > 2101 && hours <= 2400 ? "late night and advance sleep well" :
                        "error");
      const userInfo = await Users.getNameUser(event.senderID);
      const mentions = [];
      mentions.push({
        tag: userInfo,
        id: event.senderID
      })
      const msg = { body: `Hi! @${userInfo}, have a good ${session} sensei, ${itsunknown}`, mentions }
      setTimeout(function() {
        api.sendMessage(msg, event.threadID, (e, info) => {
          setTimeout(() => {
            api.sendMessage({ sticker: sticker }, event.threadID);
          }, 100);
        }, event.messageID);
      }, 5000);
    }
  }
}

module.exports.languages = {
  "vi": {
    "on": "Bật",
    "off": "Tắt",
    "successText": `${this.config.name} thành công`,
  },
  "en": {
    "on": "on",
    "off": "off",
    "successText": `${this.config.name} success!`,
  }
}

module.exports.run = async ({ event, api, Threads, getText }) => {
  let { threadID, messageID } = event;
  let data = (await Threads.getData(threadID)).data;
  if (typeof data["hi"] == "undefined" || data["hi"] == true) data["hi"] = false;
  else data["hi"] = true;
  await Threads.setData(threadID, {
    data
  });
  global.data.threadData.set(threadID, data);
  return api.sendMessage(`${(data["hi"] == false) ? getText("off") : getText("on")} ${getText("successText")}`, threadID, messageID);
};