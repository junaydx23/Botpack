module.exports.config = {
  name: "dev",
  version: "1.0.0",
  hasPermission: 2,
  credits: "Blue",
  description: "dev mode",
  commandCategory: "dev mode",
  usages: "on/off",
  cooldowns: 3,
  usePrefix: true
};

const fs = require("fs-extra");

module.exports.run = async function ({ api, event }) {

  const { threadID, messageID, body } = event;

  const status = body.toLowerCase().split(" ")[1];

  if (status === "on" || status === "off") {
        setDevMode(status === "on", api, threadID, messageID);
    }
  };

  function setDevMode(config, api, threadID, messageID) {

  const path = "./config.json";

    try {
      const configData = JSON.parse(fs.readFileSync(path, "utf8"));
      configData.DeveloperMode = config;
      fs.writeFileSync(path, JSON.stringify(configData, null, 2));

      const responseMessage = `Developer mode turn ${
        config ? 'on' : 'off'
      } successfully.`;

      api.sendMessage(responseMessage, threadID, messageID);

      restartBot(api, threadID);
      startBot(api, threadID);
    } catch (error) {
      console.error("Error fetching dev mode:", error);
      api.sendMessage("Error fetching dev mode.", threadID, messageID);
    }
  }

  function restartBot(api, threadID) {
    setTimeout(function() {
     api.sendMessage(`Restarting...`, threadID, () => process.exit(1));
    }, 10000);
  return;
}

function startBot(api, threadID) {
    setTimeout(function() {
      api.sendMessage(`Restart successfully.`, threadID, () => process.on(0));
    }, 10000);
  return;
}