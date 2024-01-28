module.exports.config = {
  name: "video",
  version: "1.0.0",
  credits: "Grey",
  hasPermission: 0,
  description: "Search for and download videos from YouTube.",
  commandCategory: "utility",
  usages: "[title]",
  cooldowns: 5,
  usePrefix: true
};

const { Innertube, UniversalCache } = require("youtubei.js");

module.exports.run = async ({ api, event, args }) => {
  api.setMessageReaction("⏳", event.messageID, (err) => {
     }, true);
  api.sendTypingIndicator(event.threadID, true);
  const fs = require("fs");
  const axios = require("axios");
  const input = event.body;
  const data = input.split(" ");
  if (data.length < 2) {
    api.sendMessage(`[ ! ] Input music video title`, event.threadID);
  } else {
    data.shift();
    const yt = await Innertube.create({ cache: new UniversalCache(false), generate_session_locally: true });
    const search = await yt.music.search(data.join(" "), { type: 'video' });

    if (search.results[0] === 0) {
      api.sendMessage("[ ! ] Video not found!", event.threadID, event.messageID);
    } else {
      api.sendMessage(`🔍 Searching for the video: ${data.join(" ")}...`, event.threadID, event.messageID);
    }

    const info = await yt.getBasicInfo(search.results[0].id);
    const url = info.streaming_data?.formats[0].decipher(yt.session.player);
    const stream = await yt.download(search.results[0].id, {
      type: 'video+audio', // audio, video or video+audio
      quality: 'best', // best, bestefficiency, 144p, 240p, 480p, 720p and so on.
      format: 'mp4' // media container format 
    });

    // Write the stream to a file and calculate the download speed and time
    const senderID = event.senderID;
    const file = fs.createWriteStream(`${__dirname}/cache/video_${senderID}.mp4`);

    async function writeToStream(stream) {
      const startTime = Date.now();
      let bytesDownloaded = 0;

      for await (const chunk of stream) {
        await new Promise((resolve, reject) => {
          file.write(chunk, (error) => {
            if (error) {
              reject(error);
            } else {
              bytesDownloaded += chunk.length;
              resolve();
            }
          });
        });
      }

      const endTime = Date.now();
      const downloadTimeInSeconds = (endTime - startTime) / 1000;
      const downloadSpeedInMbps = (bytesDownloaded / downloadTimeInSeconds) / (1024 * 1024);

      return new Promise((resolve, reject) => {
        file.end((error) => {
          if (error) {
            reject(error);
          } else {
            resolve({ downloadTimeInSeconds, downloadSpeedInMbps });
          }
        });
      });
    }

    async function main() {
      const { downloadTimeInSeconds, downloadSpeedInMbps } = await writeToStream(stream);
      const fileSizeInMB = file.bytesWritten / (1024 * 1024);

      const messageBody = `📽️ Downloaded Successfully!\n\nTitle: ${info.basic_info['title']}\n\nFile size: ${fileSizeInMB.toFixed(2)} MB\nDownload speed: ${downloadSpeedInMbps.toFixed(2)} Mbps\nDownload duration: ${downloadTimeInSeconds.toFixed(2)} seconds`;

      setTimeout(() => {

      api.setMessageReaction("✅", event.messageID, (err) => {
         }, true);
      
      api.sendMessage({
        body: messageBody,
        attachment: fs.createReadStream(`${__dirname}/cache/video_${senderID}.mp4`)
      }, event.threadID, event.messageID);
      }, 5000);

      // Remove video file after a delay of 5 seconds
      setTimeout(() => {
        fs.unlinkSync(`${__dirname}/cache/video_${senderID}.mp4`);
      }, 5000); // 5 seconds delay
    }

    main().catch(err => {
      console.error("Error while processing video download:", err);
      api.sendMessage("Oops! Something went wrong while processing the video download.", event.threadID, event.messageID);
    });
  }
};