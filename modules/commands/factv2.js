module.exports.config = {
	name: "factv2",
	version: "1.0.0",
	hasPermission: 0,
	credits: "Joshua Sy",
	description: "random fact",
	commandCategory: "fact",
  usages: "[]",
	cooldowns: 5,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {
const axios = global.nodemodule["axios"];
const res = await axios.get(`https://api.popcat.xyz/fact`);
var fact = res.data.fact;
return api.sendMessage(`Did you know : \n\n${fact}`, event.threadID, event.messageID)
 };