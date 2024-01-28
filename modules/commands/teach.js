module.exports.config = {
	name: "teach",
	version: "1.0.0",
	hasPermission: 0,
	credits: "Grey",
	description: "simsimi",
	commandCategory: "teach simsimi",
  usages: "[]",
	cooldowns: 0,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {
  api.setMessageReaction("💗", event.messageID, (err) => {
     }, true);
api.sendTypingIndicator(event.threadID, true);
  const axios = require("axios");
	try {
		const text = args.join(" ");
		const text1 = text.substr(0, text.indexOf(' => '));
		const text2 = text.split(" => ").pop();

		if (!text1 || !text2) {
			return api.sendMessage(`Usage: ${global.config.PREFIX}teach hi => hello`, event.threadID, event.messageID);
		}

		const response = await axios.get(`https://api.heckerman06.repl.co/api/other/simsimiteach?input=${encodeURIComponent(text1)}&output=${encodeURIComponent(text2)}`);
     setTimeout(function() {
		api.sendMessage(`Question : \n\n${text1}\n\nAnswer : \n\n${text2}`, event.threadID, event.messageID);
     }, 5000);
	} catch (error) {
		console.error("An error occurred:", error);
		api.sendMessage("Oops! Something went wrong.", event.threadID, event.messageID);
	}
};
