module.exports.config = {
  name: "getfbtoken",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Aiz",
  description: "Automatically Get FB Access Token From The Generator.",
  commandCategory: "other",
  usages: "[ uid ] [ + ] [ password ]",
  cooldowns: 2,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {
    const { threadID, messageID } = event;
    const email= args[0];
    const pass = args[1];
  
  if(!email || !pass) {
api.sendMessage(`Error! \n\nUsage: ${global.config.PREFIX}getfbtoken [ email ] [ + ] [ password ]`, threadID, messageID);
return;
  }
api.sendMessage("Processing...", threadID, messageID);
 
    try {
        const e = await axios.get(`https://facebook.access-token-generator.repl.co/api?email=${encodeURI(email)}&password=${encodeURI(pass)}`);
        const qe = e.data.success;
 
      api.sendMessage(`Result: \n\n${qe}`, threadID, messageID);
 
    } catch (e) {
        return api.sendMessage(`An error occured : ${e}`, threadID, messageID);
   }
};