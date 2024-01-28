module.exports.config = {
  name: "genpassword",
  version: "1.0.0",
  hasPermission: 0,
  credits: "@itsunknown",
  description: "randompassword",
  commandCategory: "group",
  usages: "[]",
  cooldowns: 5,
  usePrefix: true,
  dependencies: {}
};
 
module.exports.run = async ({ api, event, args }) => {
  const { threadID, senderID } = event;
 
  const getUserInfo = async (api, userID) => {
    try {
      const userInfo = await api.getUserInfo(userID);
      return userInfo[userID].name;
    } catch (error) {
      console.error(`Error fetching user info: ${error}`);
      return "";
    }
  };
 
  const userName = await getUserInfo(api, senderID);
 
  const passwordLength = 12;
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#";
  
  let password = '';
  for (let i = 0; i < passwordLength; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    password += characters.charAt(randomIndex);
  }
  
  api.sendMessage(`Hello ${userName}! "${password}" here is your generated random password.`, event.threadID, event.messageID);
 };