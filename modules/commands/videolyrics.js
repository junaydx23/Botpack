module.exports.config = {
  name: "videolyrics",
  version: "2.0.4",
  hasPermission: 0,
  credits: "Grey",
  description: "Play a video with music lyrics.",
  commandCategory: "utility",
  usages: "[title]",
  cooldowns: 5,
  usePrefix: true,
  dependencies: {
    "fs-extra": "",
    "request": "",
    "axios": "",
    "ytdl-core": "",
    "yt-search": ""
  }
};

module.exports.run = async ({ api, event }) => {
  api.setMessageReaction("⏳", event.messageID, (err) => {
     }, true);
  api.sendTypingIndicator(event.threadID, true);
  const axios = require("axios");
  const fs = require("fs-extra");
  const ytdl = require("ytdl-core");
  const request = require("request");
  const yts = require("yt-search");

  const input = event.body;
  const text = input.substring(12);
  const data = input.split(" ");

  if (data.length < 2) {
    return api.sendMessage("[ ! ] Input music video lyrics title.", event.threadID, event.messageID);
  }

  data.shift();
  const prompt = data.join(" ");

  try {
    api.sendMessage(`🔎 Searching music video lyrics for ${prompt}! Please wait...`, event.threadID, event.messageID);

    const res = await axios.get(`https://api.heckerman06.repl.co/api/other/lyrics2?song=${encodeURIComponent(prompt)}`);
    const lyrics = res.data.lyrics || "Not found!";
    const title = res.data.title || "Not found!";
    const artist = res.data.artist || "Not found!";

    const searchResults = await yts(prompt);
    if (!searchResults.videos.length) {
      return api.sendMessage("Error: Invalid request.", event.threadID, event.messageID);
    }

    const video = searchResults.videos[0];
    const videoUrl = video.url;

    const stream = ytdl(videoUrl, { filter: "video" });

    const fileName = `${event.senderID}.mp4`;
    const filePath = __dirname + `/cache/${fileName}`;

    stream.pipe(fs.createWriteStream(filePath));

    stream.on('response', () => {
      console.info('[DOWNLOADER]:', 'Starting Downloading...');
    });

    stream.on('info', (info) => {
      console.info('[DOWNLOADER]', `Downloading ${info.videoDetails.title} By ${info.videoDetails.author.name}`);
    });

    stream.on('end', () => {
      console.info('[DOWNLOADER]: Downloaded Successfully!');

      if (fs.statSync(filePath).size > 26214400) {
        fs.unlinkSync(filePath);
        return api.sendMessage('[ERR]: The file could not be sent because it is larger than 25MB.', event.threadID, event.messageID);
      }

      const message = {
        body: `Here's your music video enjoy! 🥰\n\nTitle: ${title}\nArtist: ${artist}\n\nLyrics: ${lyrics}`,
        attachment: fs.createReadStream(filePath)
      };

      api.setMessageReaction("✅", event.messageID, (err) => {
         }, true);
      
      api.sendMessage(message, event.threadID, () => {
        fs.unlinkSync(filePath);
      });
    });
  } catch (error) {
    console.error('[ERROR]:', error);
    api.sendMessage('An error occurred while processing the command.', event.threadID, event.messageID);
   }
};