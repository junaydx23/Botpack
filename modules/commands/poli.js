module.exports.config = {
  name: "poli",
  version: "1.0.0",
  hasPermission: 0,
  credits: "james",
  description: "generate image from polination.",
  commandCategory: "image",
  usages: "[]",
  cooldowns: 2,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {
  const axios = require('axios');
  const fs = require('fs-extra');
  const { threadID, messageID } = event;
  const query = args.join(" ");
  if (!query) return api.sendMessage("[ ! ] Type a message...", threadID, messageID);
let path = __dirname + `/cache/poli.png`;
  const poli = (await axios.get(`https://image.pollinations.ai/prompt/${query}`, {
    responseType: "arraybuffer",
  })).data;
  fs.writeFileSync(path, Buffer.from(poli, "utf-8"));
    setTimeout(function() {
  api.sendMessage({
    body: "Download Successfully!",
    attachment: fs.createReadStream(path) }, threadID, () => fs.unlinkSync(path));
    }, 5000);
};