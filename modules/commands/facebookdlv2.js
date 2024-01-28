module.exports.config = {
  name: 'facebookdlv2',
  version: '1.0.0',
  hasPermission: 0,
  credits: 'rickciel',
  description: 'Download a facebook video.',
  commandCategory: 'Utility',
  usages: '[link]',
  cooldowns: 3,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {

  api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
  api.sendTypingIndicator(event.threadID, true);

  const { threadID, messageID } = event;
  
  const axios = require('axios');
  const fs = require('fs-extra');
  const url = args[0];

  if (!url) { return api.sendMessage("Please provide a Facebook Video URL.", threadID, messageID);
  }

  try {
    api.sendMessage('Downloading...', threadID, (err, info) =>

   setTimeout(() => {
    api.unsendMessage(info.messageID) 
  }, 10000), messageID);

    const response = await axios.get(`http://eu4.diresnode.com:3301/fbdl?url=${encodeURIComponent(url)}`);
    const videoUrl = response.data.result;

    const videoBuffer = await axios.get(videoUrl, { responseType: 'arraybuffer' });
    const path = __dirname + `/cache/facebookdl/video_${event.senderID}.mp4`;
    fs.writeFileSync(path, Buffer.from(videoBuffer.data, 'binary'));
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
   return api.sendMessage(
      {
        body: "Downloaded Successfull(y).",
        attachment: fs.createReadStream(path),
      },
      threadID,
      () => fs.unlinkSync(path)
    );
  } catch (error) {
    console.error("Error downloading video:", error.message);
    api.sendMessage("An error occurred while downloading the video.", threadID, messageID);
  }
};