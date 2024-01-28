module.exports.config = {
	name: "joke",
	version: "1.0.0",
	hasPermssion: 0,
	credits: "@itsunknown",
	description: "funny-joke",
	commandCategory: "quotes",
	cooldowns: 5,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {
const axios = global.nodemodule["axios"];
const res = await axios.get(`https://api.popcat.xyz/joke`);
var joke = res.data.joke;
return api.sendMessage(`Here's your joke: \n\n${joke}`, event.threadID, event.messageID)
 };