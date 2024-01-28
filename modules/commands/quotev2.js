module.exports.config = {
  name: "quotev2",
  version: "1.0.0",
  hasPermission: 2,
  credits: "???", // I DON'T KNOW WHO PROVIDED THIS API BUT I DID IMPLEMENTED IT TO MIRAI - Yan
  description: "Randomly receive quotes",
  commandCategory: "notes",
  usages: "quotes",
  cooldowns: 10,
  usePrefix: true
};

module.exports.run = async function({ api, event }) {
  const axios = require('axios');
  try {
    const response = await axios.get('https://api.quotable.io/random');
    const quote = response.data;
    const content = quote.content;
    const author = quote.author;
    const message = `"${content}" - ${author}`;
    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    console.error('Something went wrong:', error);
    api.sendMessage('An error occurred while fetching from the API. Please try again.', event.threadID, event.messageID);
  }
};
