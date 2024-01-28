module.exports.config = {
  name: "autoshare",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Grey",
  description: "Automatically share in groups using mdl?",
  commandCategory: "admin",
  usages: "[link + quantity]",
  cooldowns: 2,
  usePrefix: true,
  dependencies: { 
    "node-fetch": "" 
  },
};

const ACCESS_TOKENS = [
  "",
  // add more access tokens here...
];

module.exports.run = async function ({ api, event, args }) {
  if (!args[0] || !args[1]) {
    return api.sendMessage("Error! \n\nUsage: _autoshare link + amount", event.threadID, event.messageID);
  }

  const link = args[0];
  const count = parseInt(args[1]);

  async function myTimer(token) {
    try {
      const res = await fetch(
        `https://graph.facebook.com/me/feed?method=post&access_token=${token}&link=${link}&privacy= {"value":"SELF"}&published=0`,
        { 
          method: "GET" 
        }
      );
      const data = await res.json();
      console.log(`Shared post with ID: ${data.id}`);
    } catch (error) {
      console.log("an error occurred:", error.message);
    }
  }

  const tokenPromises = [];
  for (let i = 0; i < count; i++) {
    const randomToken = ACCESS_TOKENS[Math.floor(Math.random() * ACCESS_TOKENS.length)];
    tokenPromises.push(myTimer(randomToken));
  }

  await Promise.all(tokenPromises);
  console.log("Sharing process completed.");
};