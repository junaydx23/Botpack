module.exports.config = {
	name: "tid",
	version: "1.0.5",
	hasPermission: 0,
	credits: "NTKhang & Yan Maglinte", // Added a function to get ThreadImage
	description: "Get box id and group image",
	commandCategory: "group",
	usages: "tid",
	cooldowns: 5,
  usePrefix: true
};

module.exports.run = async function({ api, event }) {
  const request = require('request');
  const fs = require('fs');
	const threadInfo = await api.getThreadInfo(event.threadID);
	const { threadName, participantIDs, imageSrc } = threadInfo;

	if (imageSrc) {
		const callback = async function() {
			api.sendMessage(
				{
					body: `❯ Thread ID: ${event.threadID}\n\n❯ Group Thread Image:`,
					attachment: fs.createReadStream(__dirname + '/cache/thread.png')
				},
				event.threadID,
				() => {
					fs.unlinkSync(__dirname + '/cache/thread.png');
				}
			);
		};

		request(imageSrc)
			.pipe(fs.createWriteStream(__dirname + '/cache/thread.png'))
			.on('close', callback);
	} else {
		api.sendMessage(
			`❯ Thread ID: ${event.threadID}\n\n❯ This thread does not have an image.`,
			event.threadID
		);
	}
};
