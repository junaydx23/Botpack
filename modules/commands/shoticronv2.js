const axios = require('axios');
const fs = require('fs');
const request = require('request');

const shotiAutoState = {};
const shotiAutoInterval = {};
let videoCounter = 0;
let errorVideoCounter = 0;
const lastVideoError = {};
const defaultInterval = 60 * 60 * 1000; 

module.exports.config = {
  name: 'shoticronv2',
  version: '1.0.0',
  hasPermission: 2,
  credits: 'Marjhun Baylon',
  description: 'Random shoti Video',
  commandCategory: 'entertainment',
  usages: '',
  cooldowns: 0,
  usePrefix: true
};

const shoticronv2 = async (api, event, threadID) => {
  try {
    const response = await axios.post(`https://your-shoti-api.vercel.app/api/v1/get`, { apikey: `$shoti-1hjvb0q3sokk2bvme` });
      
    if (response.data.error) {
      throw new Error(`API Error: ${response.data.error}`);
    }
     
    videoCounter++;

    const { threadID } = event;
    const path = __dirname + '/cache/shoti/shoti.mp4';
    const file = fs.createWriteStream(path);
    const rqs = request(encodeURI(response.data.data.url));
    rqs.pipe(file);

     file.on('finish', () => {
     return api.sendMessage({
        body: `Downloaded Successfull(y). \n\nuserName : \n\n@${response.data.data.user.username} \n\nuserNickname : \n\n${response.data.data.user.nickname} \n\nuserID : \n\n${response.data.data.user.userID} \n\nDuration : \n\n${response.data.data.duration}`,
        attachment: fs.createReadStream(__dirname + '/cache/shoti/shoti.mp4'),
      }, threadID, () => {
        fs.unlink(__dirname + '/cache/shoti/shoti.mp4', (err) => {
          if (err) {
            console.error('Error deleting temporary file:', err);
          }
        });
      });
    });
  } catch (error) {
    console.error('Error fetching or sending the video:', error);
    lastVideoError[threadID] = error.message;
    videoCounter++;
    errorVideoCounter++;
  }
};

module.exports.run = async ({ api, event }) => {
  const { threadID } = event;
  const commandArgs = event.body.toLowerCase().split(' ');

  const allowedAdminUID = 'globsl.config.ADMINBOT';
  if (commandArgs[1] === 'setinterval') {
    const newIntervalValue = parseFloat(commandArgs[2]);
    const newIntervalUnit = commandArgs[3]?.toLowerCase();

    if (!isNaN(newIntervalValue) && newIntervalValue > 0) {
      let newInterval;

      if (newIntervalUnit === 'hour' || newIntervalUnit === 'hours') {
        newInterval = newIntervalValue * 60 * 60 * 1000; // Convert hours to milliseconds
        const unit = newIntervalValue === 1 ? 'hour' : 'hours';
        api.sendMessage(`[ ! ] Interval time set to ${newIntervalValue} ${unit} successfully.`, threadID, (err, info) =>
        setTimeout(() => {
          api.unsendMessage(info.messageID)
        }, 10000), event.messageID);
      } else if (newIntervalUnit === 'minute' || newIntervalUnit === 'minutes') {
        newInterval = newIntervalValue * 60 * 1000; // Convert minutes to milliseconds
        const unit = newIntervalValue === 1 ? 'minute' : 'minutes';
        api.sendMessage(`[ ! ] Interval time set to ${newIntervalValue} ${unit} successfully.`, threadID, (err, info) =>
        setTimeout(() => {
          api.unsendMessage(info.messageID)
        }, 10000), event.messageID);
      } else {
        api.sendMessage('[ ! ] Invalid unit. Please try to use "minutes" or "hours".', threadID);
        return;
      }

      shotiAutoInterval[threadID] = newInterval;
    } else {
      api.sendMessage('[ ! ] Invalid interval time. Please provide a valid positive number.', threadID);
    }
    return;
  } else if (commandArgs[1] === 'interval') {
    const currentInterval = shotiAutoInterval[threadID] || defaultInterval;
    const unit = currentInterval === 60 * 60 * 1000 ? 'hours' : 'minutes';
    api.sendMessage(`[ ! ] Current interval time is set to ${currentInterval / (unit === 'hours' ? 60 * 60 * 1000 : 60 * 1000)} ${unit}.`, threadID);
    return;
  } else if (commandArgs[1] === 'on') {
    if (!shotiAutoState[threadID]) {
      shotiAutoState[threadID] = true;
      const intervalUnit = shotiAutoInterval[threadID] ? (shotiAutoInterval[threadID] === 60 * 60 * 1000 ? 'hours' : 'minutes') : 'hour';
      const intervalValue = shotiAutoInterval[threadID] ? shotiAutoInterval[threadID] / (intervalUnit === 'hour' ? 60 * 60 * 1000 : 60 * 1000) : '';
      const intervalMessage = `for every ${intervalValue} ${intervalUnit}${intervalValue === 1 ? '' : 's'}`;

      api.sendMessage(`[ ! ] Automatically sending shoti video command is now turned enabled ${intervalMessage} successfully.`, threadID, (err, info) =>
        setTimeout(() => {
          api.unsendMessage(info.messageID)
        }, 10000), event.messageID);

      shoticronv2(api, event, threadID);

      setInterval(() => {
        if (shotiAutoState[threadID]) {
          shoticronv2(api, event, threadID);
        }
      }, shotiAutoInterval[threadID] || defaultInterval);
    } else {
      api.sendMessage('[ ! ] Automatically sending shoti video command is currently enabled!', threadID);
    }
    return;
  } else if (commandArgs[1] === 'off') {
    shotiAutoState[threadID] = false;
    api.sendMessage('[ ! ] Automatically sending shoti video command is now turned disabled successfully.', threadID, (err, info) =>
        setTimeout(() => {
          api.unsendMessage(info.messageID)
        }, 10000), event.messageID);
    return;
  } else if (commandArgs[1] === 'status') {
    const statusMessage = shotiAutoState[threadID] ? 'on' : 'off';
    const intervalMessage = shotiAutoInterval[threadID] ? `Interval time set to ${shotiAutoInterval[threadID] / (shotiAutoInterval[threadID] === 60 * 60 * 1000 ? 60 : 1000)} minutes.` : 'The Interval time is set. Using the default 0 - hour interval.';
        const errorMessage = lastVideoError[threadID] ? `Last video error: ${lastVideoError[threadID]}` : '';

        api.sendMessage(`[ ! ] Command feature is currently ${statusMessage}. \n\n• Total videos sent: ${videoCounter}\n\n• Total error videos: ${errorVideoCounter}\n\n${errorMessage}`, threadID);
        return;
      } else if (commandArgs[1] === 'resetcount') {
        // Check if the user has permission to reset counts
        if (event.senderID === allowedAdminUID) {
          videoCounter = 0;
          errorVideoCounter = 0;
          api.sendMessage('[ ! ] Video counts have been reset successfully.', threadID);
        } else {
          api.sendMessage('[ ! ] You do not have permission to use reset counts.', threadID);
        }
        return;
      }

    return api.sendMessage('[ ! ] Invalid use of command.\n\n• "shoticron on", "shoticron off" - to turning ON or turning OFF.\n\n• "shoticron setinterval <minutes/hours>" - set the timer for video\n\n• "shoticron interval" - check the interval\n\n• "shoticron status" - check the status off command', threadID);
      };