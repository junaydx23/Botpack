module.exports.config = {
  name: "darkbox",
  version: "1.0.0",
  hasPermission: 0,
  credits: "Hazeyy",
  description: "Ask and get pinterest images.",
  commandCategory: "darkbox-ai",
  usages: "[ask]",
  cooldowns: 10,
  usePrefix: true
};

const axios = require('axios');
const fs = require('fs');

let lastQuery = '';

module.exports.run = async function ({ api, event, args }) {

  api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
  api.sendTypingIndicator(event.threadID, true);

  const { threadID, messageID } = event;

  if (!args[0]) {
    api.sendMessage("[ ! ] 𝖳𝗒𝗉𝖾 𝖺 𝗆𝖾𝗌𝗌𝖺𝗀𝖾．．．", threadID, messageID);
    return;
  }

  const query = args.join(" ");

  if (query === lastQuery) {
    api.sendMessage("𝖴𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗍𝗁𝖾 𝖺𝗇𝗌𝗐𝖾𝗋 𝗍𝗈 𝗍𝗁𝖾 𝗉𝗋𝖾𝗏𝗂𝗈𝗌 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇．．．", threadID, messageID);
    return;
  } else {
    lastQuery = query;
  }

   api.sendMessage("🔎 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀．．．", threadID, messageID);

  try {
    const response = await axios.get(`https://hazeyy-api-blackbox.kyrinwu.repl.co/ask?q=${encodeURIComponent(query)}`);

    if (response.status === 200 && response.data && response.data.message) {
      const answer = response.data.message;
      const formattedAnswer = formatFont(answer);
    setTimeout(function() {
      api.setMessageReaction("✅", event.messageID, (err) => {}, true);
  return api.sendMessage({ body: 
    `🧠 𝖬𝗒 𝖠𝗇𝗌𝗐𝖾𝗋 𝖨𝗌 : \n\n📃 : ${formattedAnswer}`, attachment: imgData }, threadID, messageID);
    }, 5000);

    } else {
      api.sendMessage("[ ! ] 𝖲𝗈𝗋𝗋𝗒! 𝖭𝗈 𝗋𝖾𝗅𝖾𝗏𝖺𝗇𝗍 𝖺𝗇𝗌𝗐𝖾𝗋 𝖿𝗈𝗎𝗇𝖽.", threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("[ ! ] 𝖴𝗇𝖾𝗑𝗉𝖾𝖼𝗍𝖾𝖽 𝖤𝗋𝗋𝗈𝗋! 𝖶𝗁𝗂𝗅𝖾 𝗌𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖺𝗇 𝖺𝗇𝗌𝗐𝖾𝗋 𝗈𝗇 𝖣𝖺𝗋𝗄𝖻𝗈𝗑 𝖠𝖨．．．", threadID, messageID);
    return;
  }

  const imgData = await searchPinterest(query);

async function searchPinterest(query) {
  try {
    const res = await axios.get(`https://api-dien.kira1011.repl.co/pinterest?search=${encodeURIComponent(query)}`);
    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < 6; i++) {
      let path = __dirname + `/cache/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'binary'));
      imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
    }
    for (let ii = 1; ii < 6; ii++) {
      fs.unlinkSync(__dirname + `/cache/${ii}.jpg`);
    }
    return imgData;
  } catch (error) {
    console.error(error);
    return [];
    }
  }
}

function formatFont(text) {
  const fontMapping = {
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
Z: "𝖹",
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
z: "𝗓"
};

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}

/*const axios = require('axios');
const fs = require('fs');

let lastQuery = '';

module.exports.handleEvent = async function ({ api, event }) {

  const aa = event.body ? event.body.toLowerCase() : "";

  if (aa.indexOf("darkbox") === 0) {

  api.setMessageReaction("⏳", event.messageID, (err) => {}, true);
  api.sendTypingIndicator(event.threadID, true);

  const { threadID, messageID } = event;

  const args = event.body.split(/\s+/);;
  args.shift();

  if (!args[0]) {
    api.sendMessage("[ ! ] 𝖳𝗒𝗉𝖾 𝖺 𝗆𝖾𝗌𝗌𝖺𝗀𝖾．．．", threadID, messageID);
    return;
  }

  const query = args.join(" ");

  if (query === lastQuery) {
    api.sendMessage("𝖴𝗉𝖽𝖺𝗍𝗂𝗇𝗀 𝗍𝗁𝖾 𝖺𝗇𝗌𝗐𝖾𝗋 𝗍𝗈 𝗍𝗁𝖾 𝗉𝗋𝖾𝗏𝗂𝗈𝗌 𝗊𝗎𝖾𝗌𝗍𝗂𝗈𝗇．．．", threadID, messageID);
    return;
  } else {
    lastQuery = query;
  }

   api.sendMessage("🔎 𝖲𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀．．．", threadID, messageID);

  try {
    const response = await axios.get(`https://hazeyy-api-blackbox.kyrinwu.repl.co/ask?q=${encodeURIComponent(query)}`);

    if (response.status === 200 && response.data && response.data.message) {
      const answer = response.data.message;
      const formattedAnswer = formatFont(answer);
    setTimeout(function() {
     api.setMessageReaction("✅", event.messageID, (err) => {}, true);
      return api.sendMessage({ body: 
    `🧠 𝖬𝗒 𝖠𝗇𝗌𝗐𝖾𝗋 𝖨𝗌 : \n\n📃 : ${formattedAnswer}`, attachment: imgData }, threadID, messageID);
    }, 5000);

    } else {
      api.sendMessage("[ ! ] 𝖲𝗈𝗋𝗋𝗒! 𝖭𝗈 𝗋𝖾𝗅𝖾𝗏𝖺𝗇𝗍 𝖺𝗇𝗌𝗐𝖾𝗋 𝖿𝗈𝗎𝗇𝖽.", threadID, messageID);
    }
  } catch (error) {
    console.error(error);
    api.sendMessage("[ ! ] 𝖴𝗇𝖾𝗑𝗉𝖾𝖼𝗍𝖾𝖽 𝖤𝗋𝗋𝗈𝗋! 𝖶𝗁𝗂𝗅𝖾 𝗌𝖾𝖺𝗋𝖼𝗁𝗂𝗇𝗀 𝖺𝗇 𝖺𝗇𝗌𝗐𝖾𝗋 𝗈𝗇 𝖣𝖺𝗋𝗄𝖻𝗈𝗑 𝖠𝖨．．．", threadID, messageID);
    return;
  }

  const imgData = await searchPinterest(query);

async function searchPinterest(query) {
  try {
    const res = await axios.get(`https://api-dien.kira1011.repl.co/pinterest?search=${encodeURIComponent(query)}`);
    const data = res.data.data;
    var num = 0;
    var imgData = [];
    for (var i = 0; i < 6; i++) {
      let path = __dirname + `/cache/${num+=1}.jpg`;
      let getDown = (await axios.get(`${data[i]}`, { responseType: 'arraybuffer' })).data;
      fs.writeFileSync(path, Buffer.from(getDown, 'binary'));
      imgData.push(fs.createReadStream(__dirname + `/cache/${num}.jpg`));
    }
    for (let ii = 1; ii < 6; ii++) {
      fs.unlinkSync(__dirname + `/cache/${ii}.jpg`);
    }
    return imgData;
  } catch (error) {
    console.error(error);
    return [];
      }
    }
  }
}

function formatFont(text) {
  const fontMapping = {
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
Z: "𝖹",
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
z: "𝗓"
};

  let formattedText = "";
  for (const char of text) {
    if (char in fontMapping) {
      formattedText += fontMapping[char];
    } else {
      formattedText += char;
    }
  }

  return formattedText;
}

module.exports.run = async function ({ api, event }) {}*/