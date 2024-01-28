module.exports.config = {
  name: "bio",
  version: "1.0.0",
  hasPermission: 2,
  credits: "PSTeam",
  description: "Change the bio.",
  commandCategory: "admin",
  usages: "[text]",
  cooldowns: 5,
  usePrefix: true
};

module.exports.run = async ({ api, event }) => {

  api.changeBio(args.join(" "), (e) => {
    if (e) api.sendMessage("an error occurred" + e, event.threadID); return api.sendMessage("Has changed the biography of the bot into : \n" + args.join(" "), event.threadID, event.messageID)
  });
};