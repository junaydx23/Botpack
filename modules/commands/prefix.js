module.exports.config = {
  name: "prefix",
  version: "1.0.0",
  hasPermssion: 0,
  credits: "@itsunknown",
  description: "prefix",
  commandCategory: "noPrefix",
  usages: "[]",
  cooldowns: 5,
  usePrefix: true
};

module.exports.handleEvent = async ({ event, api, Threads }) => {
  var { threadID, messageID, body, senderID } = event;
  const date = require("moment-timezone").tz("Asia/Manila").format("HH:mm:ss || L");
  function out(data) {
    api.sendMessage(data, threadID, messageID)
  }
  var dataThread = (await Threads.getData(threadID));
  var data = dataThread.data; 
  const threadSetting = global.data.threadData.get(parseInt(threadID)) || {};

  var arr = ["pref", "prefix"];
  arr.forEach(i => {
    let str = i[0].toUpperCase() + i.slice(1);
    if (body === i.toUpperCase() | body === i | str === body) {
		const prefix = threadSetting.PREFIX || global.config.PREFIX;
      if (data.PREFIX == null) {
        return out(`Here is my prefix : [ ${global.config.PREFIX} ]\n\nUse [ ${global.config.PREFIX}help ] to see all available command list. \n\n${date}`)
      }
      else return out(`Here is my prefix : [ ${global.config.PREFIX} ]\n\nUse [ ${global.config.PREFIX}help ] to see all available command list. \n\n${date}`)
    }

  });
};

module.exports.run = async({ event, api }) => {};
