module.exports.config = {
  name: "restart",
  version: "1.0.0",
  hasPermission: 2,
  credits: "manhIT",
  description: "Restart the system",
  commandCategory: "system",
  usages: "[]",
  cooldowns: 5,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {
  const { threadID, messageID } = event;
  return api.sendMessage(`[ OK ] • ${global.config.BOTNAME} The bot are now restarting...`, threadID, () => process.exit(1), messageID);
 };