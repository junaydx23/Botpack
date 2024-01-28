module.exports.config = {
  name: "goai",
  version: "1.0.0",
  hasPermission: 0,
  credits: "libyzxy0",
  description: "ChatGPT + Bard Combination Artificial Intelligence.",
  commandCategory: "other",
  usages: "[ask]",
  cooldowns: 5,
  usePrefix: true,
  dependencies: {}
}

module.exports.run = async ({ api, event }) => {
  api.setMessageReaction("⏳", event.messageID, (err) => {
     }, true);

api.sendTypingIndicator(event.threadID, true);
  
  const apiKey = `${global.config.OPENAI}`;
  const axios = require("axios");
  const fs = require("fs");
  const request = require("request");
  let input = event.body;
  let data = input.split(" ");
  let userInfo = await api.getUserInfo(event.senderID);
  userInfo = userInfo[event.senderID]
  if (data.length < 2) {
    const response = [
            "what", "zupp"
        ];
        const randomResponse = response[Math.floor(Math.random() * response.length)];
    
    api.sendMessage(randomResponse,
      event.threadID,
      event.messageID
    );
  } else {
    data.shift();
    let msg = data.join(" ");
    const headers = {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    };

    const body = {
      message: msg,
      firstName: userInfo.firstName,
      lastName: userInfo.name,
      setName: "ကြိုက်တယ်",
    };
    let res = await axios.post('https://go-ai.libyzxy0.repl.co/', body, { headers });
    let response = res.data.content;
    const imageUrlPattern = /!\[.*?\]\((.*?)\)/;
    const matches = response.match(imageUrlPattern);
    if (matches && matches.length > 1) {
      const imageUrl = matches[1];
      console.log(imageUrl);
      let txt = response.split('!');
      let file = fs.createWriteStream(__dirname + "/cache/goai_image.png");
      let rqs = request(imageUrl);
      rqs.pipe(file);
      file.on("finish", () => {
        api.sendMessage({
          body: txt[0],
          attachment: fs.createReadStream(
            __dirname + "/cache/goai_image.png"
          ),
        },
          event.threadID,
          event.messageID
        );
      });
    } else {
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      api.sendMessage(response, event.threadID, event.messageID)
    }
  }
};