module.exports.config = {
	name: "sim",
	version: "1,0,0",
	hasPermission: 0,
	credits: "Grey",
	description: "simsimi",
	commandCategory: "simsimi",
  usages: "[msg]",
	cooldowns: 0,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {
  api.setMessageReaction("⏳", event.messageID, (err) => {
     }, true);
api.sendTypingIndicator(event.threadID, true);
  const axios = require("axios");
	try {
		let message = args.join(" ");
		if (!message) {
			return api.sendMessage(`[ ! ] Type a message...`, event.threadID, event.messageID);
		}

		const response = await axios.get(`https://api.heckerman06.repl.co/api/other/simsimi?message=${message}&lang=ph`);
		const respond = response.data.message;
     setTimeout(function() {
    api.setMessageReaction("✅", event.messageID, (err) => {}, true);
		api.sendMessage(respond, event.threadID, event.messageID);
     }, 5000);
	} catch (error) {
		console.error("An error occurred:", error);
		api.sendMessage("Oops! Something went wrong.", event.threadID, event.messageID);
	}
};
