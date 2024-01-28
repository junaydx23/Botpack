module.exports.config = {
  name: "setnickname",
  version: "1.0.0",
  hasPermission: 2,
  credits: "Khánh Milo",
  description: "Set all nickname",
  commandCategory: "group",
  usages: "[]",
  cooldowns: 3,
  usePrefix: true
};

module.exports.run = async function({ api, event, args }) {
  var threadInfo = await api.getThreadInfo(event.threadID)
  var id = threadInfo.participantIDs
  const usernickname = args.join(" ")
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  };
  for (let setnickname of id) {
    await delay(5000)
    api.changeNickname(`${usernickname}`, event.threadID, setnickname);
  }
};