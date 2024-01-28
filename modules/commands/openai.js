module.exports.config = {
  name: "openai",
  version: "1.0.0",
  hasPermission: 0,
  credits: "@itsunknown",
  description: "Can assist you in completing your homework, speech, and even essays.",
  commandCategory: "chat-ai",
  usages: "[ask]",
  cooldowns: 7,
  usePrefix: true,
  dependencies: {}
};

const fs = require("fs");
const axios = require("axios"); 

async function getUserInfo(api, senderID) {
  try {
    
    const userInfo = await api.getUserInfo(senderID);
    return userInfo[senderID].name;
  } catch (error) {
    console.log(error);
    return "User";
  }
}

module.exports.run = async function({ api, event, args, Users, Threads }) {

  api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
  api.sendTypingIndicator(event.threadID, true);

  const apiKey = `${global.config.OPENAI}`;
  const url = "https://api.openai.com/v1/chat/completions";
  const senderID = event.senderID;
  const wm = `\n\nThe bot is under developed by Bundas Andrian. \n\nDon't forget to follow : \n\nhttps://facebook.com/100037363620456 \n\nThank you.`;

  // Get the user's name
  const userInfo = await getUserInfo(api, senderID);
                
  const promptMessage = ``; 
  const blank = args.join(" ");
  const data = userInfo + `User: ${args.join(" ")}\n`;
  
  if (blank.length < 2) {
      
    api.sendMessage({ body: `Hello! @${userInfo}, How may i help you?`, mentions: [{
          tag: "@" + userInfo,
          id: senderID
        }]
      }, event.threadID, event.messageID);

  } else {
      api.sendMessage("🔍 Searching... \n\nQuestion :\n\n" + args.join(" "), event.threadID, event.messageID)
    try {
      const response = await axios.post(
        url,
        {
          model: "gpt-3.5-turbo",
          messages: [
            { role: "system", content: promptMessage },
            { role: "user", content: data },
          ],
          temperature: 0.7,
          max_tokens: 2800,
          top_p: 0.30,
          frequency_penalty: 0,
          presence_penalty: 0,
        },
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`,
          },
        }
      );

      const message = response.data.choices[0].message.content;
      
      setTimeout(function() {

      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
        
      api.sendMessage(message + wm, event.threadID, event.messageID);
      }, 5000);
      
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
      } else {
        console.log(error.message);
        api.sendMessage(error.message, event.threadID);
      }
    }
  }
};