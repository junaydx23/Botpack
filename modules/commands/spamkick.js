module.exports.config = {
  name: "spamkick",
  version: "1.1.0",
  hasPermission: 2,
  credits: "Marjhun Baylon and Miko Mempin",
  description: "Automatically detect and act on spam",
  commandCategory: "admin",
  usages: "[on/off]",
  cooldowns: 5,
  usePrefix: true
};

let messageCounts = {};
let spamDetectionEnabled = true;
const spamThreshold = 5;
const spamInterval = 30000;

module.exports.run = function ({ api, event, args }) {
  const mode = args[0]?.toLowerCase();

  if (mode === "on") {
    spamDetectionEnabled = true;
    api.sendMessage("[ ! ] Spam detection is now enabled successfully.", event.threadID, event.messageID);
  } else if (mode === "off") {
    spamDetectionEnabled = false;
    api.sendMessage("[ ! ] Spam detection is now disabled successfully.", event.threadID, event.messageID);
  } else {
    api.sendMessage("Invalid usage. Use 'on' to enable and 'off' to disable spam detection.", event.threadID, event.messageID);
  }
};

module.exports.handleEvent = function ({ api, event }) {
  const { threadID, messageID, senderID } = event;

  if (!spamDetectionEnabled) {
    return;
  }

  if (!messageCounts[threadID]) {
    messageCounts[threadID] = {};
  }

  if (!messageCounts[threadID][senderID]) {
    messageCounts[threadID][senderID] = {
      count: 1,
      timer: setTimeout(() => {
        delete messageCounts[threadID][senderID];
      }, spamInterval),
    };
  } else {
    messageCounts[threadID][senderID].count++;
    if (messageCounts[threadID][senderID].count > spamThreshold) {
      api.removeUserFromGroup(senderID, threadID);
      api.sendMessage({
        body: "\n",
        mentions: [{
          tag: senderID,
          id: senderID,
        }],
      }, threadID, messageID);
    }
  }
};