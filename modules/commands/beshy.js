module.exports.config = {
  name: "beshy",
  version: "1.0.0",
  hasPermission: 0,
  credits: "@itsunknown",
  description: "fun",
  commandCategory: "group",
  usages: "[]",
  cooldowns: 5,
  usePrefix: true,
  dependencies: {},
  envConfig: {},
};

module.exports.run = function ({ api, event, args }) {
  const { threadID, messageID} = event;
  const message = args.map(word => word + '🤸‍♂️').join(' ');
  api.sendMessage(message, threadID, messageID);
};