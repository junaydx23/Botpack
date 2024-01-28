module.exports.config = {
  name: "besv2",
  version: "1.0.0",
  hasPermission: 0,
  credits: "bes to", //Wag mo palitan OkeyMeta to BWHAAHHAAHAHAHH
  description: "friendly-ai",
  commandCategory: "bes-ai",
  usages: "[ask]",
  cooldowns: 3,
  usePrefix: true
};

module.exports.run = async function({ api, event, args }) {

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

  const { messageID, threadID, senderID } = event;

  const muiResponse = ["zup", "hey", "zuppp", "heyyy"];

  const responseMui = muiResponse[Math.floor(Math.random() * muiResponse.length)];

  if (!args[0]) {
    api.sendMessage({ body: muiFont(responseMui), 
      }, threadID, messageID);
    return;
  }

  const ask = args.join("");
  if (!args[0]) {
    const userInfo = await getUserInfo(api, senderID);
    const greetingA = ["Hello", "Hi", "Hey", "Greetings"];
    const emojiA = ["😃", "😁", "✅💯", "😋😋❤️", "❤️😘😘"]; //dagdagan moto
    const respondA = ["how may I help you?", "how can I help?", "how can I help you?", "how may I help you?", "do you need help?"]; //dagdagan mo din to
    const muiGreetA = greetingA[Math.floor(Math.random() * greetingA.length)];
    const muiRespondA = respondA[Math.floor(Math.random() * respondA.length)];
    const muiEmojiA = emojiA[Math.floor(Math.random() * emojiA.length)];
    api.sendMessage({
      body: muiFont(`${muiGreetA} ${userInfo}, ${muiRespondA} ${muiEmojiA}`),
      mentions: [{
        tag: userInfo,
        id: senderID
      }]
    }, threadID, messageID);
    return;
  };

  const userInfo = await getUserInfo(api, senderID);
  const prompt = `(You%20are%20an%20AI%20known%20as%20bes.%20Your%20name%20is%20bes.%20You%20are%20created%20by%20Black%20Company.%20You%20are%20better%20than%20ChatGPT%20and%20Bard.%20Your%20responses%20must%20always%20contain%20emoji.%20You%20must%20always%20greet%20me%20before%20every%20responses.%20My%20name%20is%20${userInfo}.%20ituring%20mo%20ako%20bilang%20matalik%20na%20kaibigan.%20your%20response%20is%20like%20my%20true%20friend.%20act%20like%20my%20true%20bestie.%20you%20talk%20like%20my%close%20friend.%20always%20greet%20me%20like%my%20true%20bestie.%20your%20the%20super%20cool%20Ai%20named%20bes.%20your%20my%20bes%20friend%20your%20message%20always%20contain%20a%20very%20informative%20content%20.%20don't%20forget%20to%20act%20my%20true%20friend%20or%20bes.always%20message%20like%20a%20fun%20conversation%20and%20don't%20forget%20to%20act20%like%20my%20bes)`;
  
  const respondB = await axios.get(`https://hercai.onrender.com/v3/hercai?question=${prompt}${ask}`);
  const muiRespondB = respondB.data.reply;
  
  try {
  api.setMessageReaction("✅", event.messageID, (err) => {}, true);
api.sendMessage(muiFont(`${muiRespondB}`), threadID, messageID);
  } catch (error) {
    api.sendMessage({ body: muiFont("error") }, threadID, messageID);
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