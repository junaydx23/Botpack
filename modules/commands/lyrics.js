module.exports.config = {
  name: "lyrics",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Grey",
  description: "Lyrics Finder",
  commandCategory: "lyrics",
  usage: "[title]",
  cooldowns: 5,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {

  api.setMessageReaction("💗", event.messageID, (err) => {
     }, true);

api.sendTypingIndicator(event.threadID, true);

  const axios = require('axios');
  const request = require('request');
  const fs = require('fs');
  const prompt = args.join(' ');

  if (!prompt) {
    return api.sendMessage('Please enter a song.', event.threadID, event.messageID);
  } else {
    axios.get(`https://api.heckerman06.repl.co/api/other/lyrics2?song=${encodeURIComponent(prompt)}`)
      .then(res => {
        const { title, artist, lyrics, image } = res.data;

        const callback = () => {
          api.sendMessage({
            body: `Title: ${title}\n\nArtist: ${artist}\n\nLyrics: ${lyrics}`,
            attachment: fs.createReadStream(__dirname + '/cache/image.png')
          }, event.threadID, () => fs.unlinkSync(__dirname + '/cache/image.png'), event.messageID);
        };

        request(encodeURI(image))
          .pipe(fs.createWriteStream(__dirname + '/cache/image.png'))
          .on('close', callback);
      })
      .catch(error => {
        console.error('Lyrics API error:', error);
        api.sendMessage('Failed to fetch lyrics.', event.threadID, event.messageID);
      });
  }
};