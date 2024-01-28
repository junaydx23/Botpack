module.exports.config = {
  name: "chatme",
  version: "1.0.0",
  hasPermission: 0,
  credits: "libyzxy0",
  description: "chatme",
  commandCategory: "other",
  usages: "[ask]",
  cooldowns: 7,
  usePrefix: true,
  dependencies: {}
};

module.exports.run = async function ({ api, event, args }) {

  api.setMessageReaction("⏳", event.messageID, (err) => {
     }, true);

api.sendTypingIndicator(event.threadID, true);
  
  const axios = require("axios");
  let userInfo = await api.getUserInfo(event.senderID);
  userInfo = userInfo[event.senderID];
  const blank = args.join(" ");
  let data = event.body.split(" ");
  if (blank.length < 2) {
    api.sendMessage('[ ! ] Type a message...', event.threadID, event.messageID);
  } else {
    
 try {
  data.shift() 
axios.post('https://chat.libyzxy0.repl.co/api/v1/chat-api', {
        message: data.join(" "),
        userInfo,
        location: "Philippines",
        apikey: `${global.config.OPENAI}`,
        font: "disable",
        botName: `ကြိုက်တယ်`
      }).then((response) => {
        const message = response.data.message;

      setTimeout(function() {
        api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        api.sendMessage(message, event.threadID, event.messageID);
      }, 5000);
      }).catch((err) => {
        console.log(err)
        api.sendMessage(`${err}`, event.threadID, event.messageID);
      });
    } catch (err) {
      console.log(err);
      api.sendMessage(`error: ${err}`, event.threadID, event.messageID);
    }
  }
};