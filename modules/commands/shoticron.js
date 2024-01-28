module.exports.config = {
  name: "shoticron",
  version: "2.0.0",
  hasPermission: 2,
  credits: "Eugene Aguilar", //converted to mirai by Kyouya Dev
  description: "Automaticaly send shoti with on and off",
  commandCategory: "shoti cron",
  usages: "[enabled/disabled]",
  cooldowns: 5,
  usePrefix: true
};

const activeThreads = {};

module.exports.run = async function({ api, event }) {
  const cron = require('node-cron');
  const axios = require("axios");
  const request = require('request');
  const fs = require("fs");

  const args = event.body.split(" ");
  const threadID = event.threadID;

  if (args[1] === "enabled") {

    if (!activeThreads[threadID]) {
      activeThreads[threadID] = true;
      api.sendMessage(`Automatically sending shoti command function for every 1 minutes is now enabled successfully.`, event.threadID, (err, info) =>
        setTimeout(() => {
          api.unsendMessage(info.messageID)
        }, 20000), event.messageID);

      cron.schedule('*/1 * * * *', async () => {
        try {
          if (activeThreads[threadID]) {
            const response = await axios.post(`https://your-shoti-api.vercel.app/api/v1/get`, { apikey: `$shoti-1hjvb0q3sokk2bvme` });

            const path = __dirname + `/cache/shoti/shoti.mp4`;
            const file = fs.createWriteStream(path);
            const rqs = request(encodeURI(response.data.data.url));
            rqs.pipe(file);
            file.on(`finish`, () => {
              return api.sendMessage({
                body: `Downloaded Successfull(y). \n\nuserName : \n\n@${response.data.data.user.username} \n\nuserNickname : \n\n${response.data.data.user.nickname} \n\nuserID : \n\n${response.data.data.user.userID} \n\nDuration : \n\n${response.data.data.duration}`,
                attachment: fs.createReadStream(path)
              }, threadID, (error, info) => {
                if (!error) {
                  fs.unlinkSync(__dirname + '/cache/shoti/shoti.mp4');
                }
              });
            });
          }
        } catch (error) {
          console.error('Error:', error);
        }
      });
    } else {
      api.sendMessage("Automatically sending shoti video is already enabled on this thread.", threadID);
    }
  } else if (args[1] === "disabled") {
    if (activeThreads[threadID]) {
      activeThreads[threadID] = false;
      api.sendMessage(`Automatically sending shoti command function for every 1 minutes is now disabled successfully.`, event.threadID, (err, info) =>
        setTimeout(() => {
          api.unsendMessage(info.messageID)
        }, 20000), event.messageID);
    } else {
      api.sendMessage("Automatically sending shoti video is already disabled on this thread.", threadID);
    }
  }
};