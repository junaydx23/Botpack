module.exports.config = {
  name: "siri",
  version: "30.0",
  hasPermission: 0,
  credits: "anjelo",
  description: "artificial-intelligents",
  commandCategory: "utilities",
  usages: "[ask]",
  cooldowns: 5,
  usePrefix: true,
  dependencies: {
    "openai": ""
  }
};

const { Configuration, OpenAIApi } = require("openai");

module.exports.run = async function ({ api, event, args }) {

  api.setMessageReaction("⏳", event.messageID, (err) => {
     }, true);

api.sendTypingIndicator(event.threadID, true);
  
  const configuration = new Configuration({
    apiKey: `${global.config.OPENAI}`
  });

  const openai = new OpenAIApi(configuration);
  let message = args.join(" ");

  if (!message) {
    api.sendMessage("[ ! ] Type a message...", event.threadID, event.messageID);
    return;
  }
  
  // Add preparing message
  api.sendMessage(`🔎 Searching... \n\nQuestion : \n\n${message}`, event.threadID);
  try {
    const completion = await openai.createCompletion({
      model: "text-davinci-003",
                  prompt: message,
                  temperature: 0.5,
                  max_tokens: 2048,
                  top_p: 0.3,
                  frequency_penalty: 0.5,
                  presence_penalty: 0.0,
    });  
 
    setTimeout(function() {

    api.setMessageReaction("✅", event.messageID, (err) => {}, true);

api.sendMessage(completion.data.choices[0].text, event.threadID, event.messageID);
    }, 5000);
    
  } catch (err) {
    if (err.response) {
      if (err.response.status === 401) {
        api.sendMessage("Something went wrong! Please try again later.", event.threadID);
      } else {
        console.log(err.response.status);
        console.log(err.response.data);
        api.sendMessage("err.", event.threadID);
      }
    } else {
      console.log(err.message);
      api.sendMessage(err.message, event.threadID);
    }
  }
};