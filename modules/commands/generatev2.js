module.exports.config = {
	name: "generatev2",
	version: "1.0.0",
	hasPermission: 0,
	credits: "Prince Sanel",
	description: "Generates Random",
	commandCategory: "Picture",
	usages: "[text]",
	cooldowns: 10,
  usePrefix: true
	};

module.exports.run = async ({ api, event, args }) => {
	const { createReadStream, existsSync, mkdirSync } = global.nodemodule["fs-extra"];
	const axios = require('axios');
	const request = require('request');
	const fs = require("fs");
	const responce = args.join(" ");
	if (!responce) 
        return api.sendMessage(`[ ! ] Type a message...`, event.threadID, event.messageID);
	api.sendMessage(`Generating ${responce}! Please wait..`, event.threadID, event.messageID);
	res = await axios.get(`http://geneapi.rapos93130.repl.co/api/gene=${responce}`);
	response = res.data.url;
	var callback = () => api.sendMessage({ body: `Generated: ${responce}`, attachment: fs.createReadStream(__dirname + "/cache/gen/genv2.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/gen/genv2.jpg"));
    return request(encodeURI(response)).pipe(fs.createWriteStream(__dirname + "/cache/gen/genv2.jpg")).on("close", () => callback());
  }
    