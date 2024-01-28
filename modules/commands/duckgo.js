module.exports.config = {
  name: 'duckgo',
  version: '1.0.0',
  hasPermission: 0,
  credits: 'Yan',
  description: 'Searches the DuckDuckGo API for information.',
  commandCategory: 'message',
  usages: '[query]',
  cooldowns: 3,
  usePrefix: true
};

module.exports.run = async function({ api, event, args }) {
  const axios = require('axios');
  const query = args.join(' ');
  if (!query) {
    return api.sendMessage('⚠️ Missing Input', event.threadID, event.messageID);
  }
  try {
    const response = await axios.get(`https://api.duckduckgo.com/?q=${encodeURIComponent(query)}&format=json&pretty=1`);
    let heading = response.data.Heading;
    let abstract = response.data.Abstract;
    if (!heading) {
      heading = 'Not Found';
    }
    if (!abstract) {
      abstract = 'Not Found';
    }
    const message = `🔎 You searched for: ${query}\n\nTopic: ${heading}\n\n${abstract}`;

    api.sendMessage(message, event.threadID, event.messageID);
  } catch (error) {
    api.sendMessage(`❌ ${error.message}`, event.threadID, event.messageID);
  }
};