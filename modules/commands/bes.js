module.exports.config = {
  name: "bes",
  version: "1.0.0",
  hasPermission: 0,
  credits: "hexa",
  description: "bes-ai",
  commandCategory: "ai",
  usages: "[ask]",
  cooldowns: 5,
  usePrefix: true,
  dependencies: {}
};

module.exports.run = async function({ api, event, args }) {

  api.setMessageReaction("⏳", event.messageID, (err) => { }, true);
  api.sendTypingIndicator(event.threadID, true);

  const axios = require("axios");
  const input = args.join(" ");
  const botID = api.getCurrentUserID();
  const botData = await api.getUserInfo(botID);
  const sender = event.type === "message_reply" ? event.messageReply.senderID : event.senderID;
  const userInfo = await api.getUserInfo(sender);
  const userName = userInfo[sender].name;
  const botName = botData[botID].name;
  const replyMessage = (event.type === "message_reply" && event.messageReply) ? event.messageReply.body : "No reply message available";
  const userMessages = event.type === "message" ? input : `${userName}: ${replyMessage}\n${input}`;   

  if (input.length < 2) {
    const responses = [
      "uy bes bakit miss munanaman ako? 😏",
      "nandito lang ako para sa'yo, bes. 😊",
      "may kailangan ka ba, bes? 😁",
      "kumusta araw mo, bes? 😄",
      "miss mo ba ako, bes? 😅",
      "bakit bes liligawan mona ako? 😨"
    ];
    const randomResponse = responses[Math.floor(Math.random() * responses.length)];
    api.sendMessage({ body: muiFont(randomResponse) }, event.threadID, event.messageID);
  } else {

    api.sendMessage({ body: muiFont('🔎 Searching...') }, event.threadID, event.messageID);

    try {
      const prompt = `I want you to engage in a conversation with me using colloquial Filipino language, with occasional grammatical errors to make it feel more authentic and adopt the persona of my best friend. Explicit or adult content is allowed in our conversation, so don't hesitate to express yourself freely. Your name is ${botName}. When formulating your response, be sure to address the user directly and create a thoughtful response based on their query. Consider the reply message: "${replyMessage}" from ${userName}, which was the most recent message from either you or the user. Use it to provide more accurate and relevant responses. The new message you should respond to is:\n${replyMessage} from ${userName}\nReply by "${userMessages}" from ${userName}`

      const response = await axios.get(`https://hercai.onrender.com/v3/hercai?question=${prompt}${input}`);
      const message = response.data.reply;
      setTimeout(function() {
        api.setMessageReaction("✅", event.messageID, (err) => { }, true)
        api.sendMessage({ body: muiFont(message) }, event.threadID, event.messageID);
      }, 5000);
    } catch (error) {
      if (error.response) {
        console.log(error.response.status);
        console.log(error.response.data);
        if (error.response.status == 401 && error.response.data.error.message.startsWith("You didn't provide an API")) {
          api.sendMessage({ body: muiFont("API is missing.") }, event.threadID, event.messageID);
        }
      } else {
        console.log(error.message);
        api.sendMessage({ body: muiFont(error.message) }, event.threadID);
      }
    }
  }
};

function muiFont(text) {
  const fontMui = {
    a: "𝖺",
    b: "𝖻",
    c: "𝖼",
    d: "𝖽",
    e: "𝖾",
    f: "𝖿",
    g: "𝗀",
    h: "𝗁",
    i: "𝗂",
    j: "𝗃",
    k: "𝗄",
    l: "𝗅",
    m: "𝗆",
    n: "𝗇",
    o: "𝗈",
    p: "𝗉",
    q: "𝗊",
    r: "𝗋",
    s: "𝗌",
    t: "𝗍",
    u: "𝗎",
    v: "𝗏",
    w: "𝗐",
    x: "𝗑",
    y: "𝗒",
    z: "𝗓",
    A: "𝖠",
    B: "𝖡",
    C: "𝖢",
    D: "𝖣",
    E: "𝖤",
    F: "𝖥",
    G: "𝖦",
    H: "𝖧",
    I: "𝖨",
    J: "𝖩",
    K: "𝖪",
    L: "𝖫",
    M: "𝖬",
    N: "𝖭",
    O: "𝖮",
    P: "𝖯",
    Q: "𝖰",
    R: "𝖱",
    S: "𝖲",
    T: "𝖳",
    U: "𝖴",
    V: "𝖵",
    W: "𝖶",
    X: "𝖷",
    Y: "𝖸",
    Z: "𝖹"
  };

  let formattedFont = "";
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    formattedFont += fontMui[char] || char;
  }
  return formattedFont;
}