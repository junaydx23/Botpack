module.exports.config = {
  name: "gptgo",
  version: "1.0.0",
  hasPermission: 0,
  credits: "KENLIEPLAYS",
  description: "GPTGO by KENLIEPLAYS",
  commandCategory: "ai",
  usages: "[ask]",
  cooldowns: 2,
  usePrefix: true
};

module.exports.run = async function({ api, event, args }) {
    api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
  api.sendTypingIndicator(event.threadID, true);
    const wm = `\n\nThe bot is under developed by Bundas Andrian. \n\nDon't forget to follow : \n\nhttps://facebook.com/100037363620456 \n\nThank you.`;
    const axios = require("axios");
    const { messageID, threadID } = event;
    const tid = threadID,
    mid = messageID;
    const content = encodeURIComponent(args.join(" "));
    if (!args[0]) return api.sendMessage("[ ! ] Type a message...", tid, mid);
    try {
        const res = await axios.get(`https://api.kenliejugarap.com/gptgo/?text=${content}`);
        const respond = res.data.response;
        if (res.data.error) {
            api.sendMessage(`Error: ${res.data.error}`, tid, (error, info) => {
                if (error) {
                    console.error(error);
                }
            }, mid);
        } else {
          api.setMessageReaction("✅", event.messageID, (err) => {}, true);
            api.sendMessage(respond + wm, tid, (error, info) => {
  
                if (error) {
                    console.error(error);
                }
            }, mid);
        }
    } catch (error) {
        console.error(error);
        api.sendMessage("An error occurred while fetching the data.", tid, mid);
   }
}