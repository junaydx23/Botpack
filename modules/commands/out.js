module.exports.config = {
  name: "out",
  version: "1.0.0",
  hasPermission: 2,
  credits: "Kanichi",
  description: "",
  commandCategory: "Admin",
  usages: "[uid]",
  cooldowns: 10,
  usePrefix: true
};

module.exports.run = async function({ api, event, args }) {
  if (!args[0]) return api.removeUserFromGroup(api.getCurrentUserID(), event.threadID);
  if (!isNaN(args[0])) return api.removeUserFromGroup(api.getCurrentUserID(), args.join(" "));
};