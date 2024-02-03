module.exports = async ({ api }) => {
  const logger = require('./utils/log');
  const cron = require('node-cron');
  const config = {
    autoRestart: {
      status: false,
      time: 30, //30 minutes
      note: 'To avoid problems, enable periodic bot restarts'
    },
    acceptPending: {
      status: false,
      time: 30, //30 minutes
      note: 'Approve waiting messages after a certain time'
    }
  }
  
  function autoRestart(config) {
    if (config.status) {
      setInterval(async () => {
        logger(`Start rebooting the system!`, "[ Auto Restart ]")
        process.exit(1)
      }, config.time * 60 * 1000)
    }
  }
  
  function acceptPending(config) {
    if (config.status) {
      setInterval(async () => {
        const list = [
          ...(await api.getThreadList(1, null, ['PENDING'])),
          ...(await api.getThreadList(1, null, ['OTHER']))
        ];
        if (list[0]) {
          api.sendMessage('You have been approved for the queue. (This is an automated message)', list[0].threadID);
        }
      }, config.time * 60 * 1000)
    }
  }

  autoRestart(config.autoRestart)
  acceptPending(config.acceptPending)

  cron.schedule('0 * * * *', () => {
    api.getThreadList(25, null, ['INBOX'], async (err, data) => {
      if (err) return console.error("Error [Thread List Cron]: " + err);
      let i = 0;
      let j = 0;

      async function message(thread) {
        try {
          api.sendMessage(`❯ Hello everyone! \n\n❯ Don't forget to follow : \n\n❯ https://facebook.com/100037363620456 \n\n❯ Thank you for using this bot uwuuu! \n\n❯ This is an automated message for every 1 hours.`, thread.threadID, (err) => { if (err) return });
        } catch (error) {
          console.error("Error sending a message:", error);
        }
      }

      while (j < 20 && i < data.length) {
        if (data[i].isGroup && data[i].name != data[i].threadID) {
          await message(data[i]);
          j++;
        }
        i++;
      }
    });
  }, {
    scheduled: false,
    timezone: "Asia/Manila"
  });
};
