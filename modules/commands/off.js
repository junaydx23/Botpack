module.exports.config = {
	name: "off",
	version: "1.0.0",
	hasPermission: 2,
	credits: "HTHB",
	description: "turn the bot off",
	commandCategory: "system",
	cooldowns: 0,
  usePrefix: true
};

module.exports.run = ({ event, api }) => {
  return api.sendMessage(`[ OK ] • ${global.config.BOTNAME} are now turning off...`,event.threadID, () => process.exit(0))
 };