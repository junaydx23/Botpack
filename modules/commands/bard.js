module.exports.config = {
  name: "bard",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Grey, Daniel",
  description: "Google Bard is a natural language generation model can generate poetry and rhyming verse.",
  usePrefix: true,
  commandCategory: "bard-ai",
  usages: "[ask]",
  cooldowns: 5,
  usePrefix: true
};

module.exports.run = async function({ api, event }) {
  api.setMessageReaction("💗", event.messageID, (err) => {}, true);
  api.sendTypingIndicator(event.threadID, true);
  const fs = require("fs");
  const axios = require("axios");
  const { threadID, messageID } = event;
  const cookies = "agiums2fEJswi7CxbrdwwfxTFWSRAbdUaIRKcyrUwJuDuyl3baGqLc_RMVsyws9L3f98PQ."; // place your bard cookie here
  const response = event.body.slice(5).trim();

  if (!response) {
    api.sendMessage("Please provide a question or query!", threadID, messageID);
    return;
  }

  api.sendMessage("🔎 Searching...", threadID, messageID);

  try {
    const res = await axios.get(`https://gptgotest.lazygreyzz.repl.co/ask?cookies=${cookies}&question=${response}`);
    const responseData = JSON.parse(res.data.response);
    const message = responseData.response;
    const imageUrls = responseData.image;

    if (message && message.length > 0) {
      const photoUrls = imageUrls.map(url => url.replace(/\\(.)/mg, "$1")); 

      const photoAttachments = [];

      if (!fs.existsSync("cache")) {
        fs.mkdirSync("cache");
      }

      for (let i = 0; i < photoUrls.length; i++) {
        const url = photoUrls[i];
        const photoPath = __dirname + `/cache/img/photo_${i + 1}.png`;

        try {
          const imageResponse = await axios.get(url, { responseType: "arraybuffer" });
          fs.writeFileSync(photoPath, imageResponse.data);

          photoAttachments.push(fs.createReadStream(photoPath));
        } catch (error) {
          console.error("Error occurred while downloading and saving the photo:", error);
        }
      }

      api.sendMessage(
        {
          attachment: photoAttachments,
          body: message,
        },
        threadID,
        messageID
      );
    } else {
      api.sendMessage(message, threadID, messageID);
    }
  } catch (error) {
    console.error("Error occurred while fetching data from the Bard API:", error);
    api.sendMessage("An error occurred while processing your request.", threadID, messageID);
  }
};