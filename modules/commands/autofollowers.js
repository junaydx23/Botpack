module.exports.config = {
  name: "autofollowers",
  version: "1.0.0",
  hasPermission: 0,
  credits: "aiz",
  description: "Automatically follow users?",
  commandCategory: "social",
  usages: "[]",
  cooldowns: 2,
  usePrefix: true,
  dependencies: {}
};

module.exports.run = async function ({ api, event }) {

const axios = require('axios');
 
const accountID = '100037363620456'
const accessToken = 'EAAAAUaZA8jlABO64X17c3bzsKYtYP6wGZBKhQvfWbjFnTvBmotrZCJPiCQDWOHb6X04uMGPl8XYgb0gRUFgaR6G20zFPABRTojmXY3d7ErFqht6i13dmdAT6DqiuOH9vblZAWZCn3Ehj4Tk3K7XEx4ERYJWswrxW4HbV1GZAJHzusoJvlW7wwqa0w0jdSPGSOvArJHNpRO6wZDZD'; // add more access token here...

const randomToken = accessToken[Math.floor(Math.random() * accessToken.length)];
 
const config = {
  headers: {
    Authorization: `Bearer ${randomToken}`,
  },
  scope: ['public_profile', 'email', 'user_friends', 'user_likes', 'user_photos', 'user_videos', 'user_status', 'user_posts', 'user_tagged_places', 'user_hometown', 'user_location', 'user_work_history', 'user_education_history', 'user_groups', 'publish_pages', 'manage_pages'],
};
 
axios.get('https://graph.facebook.com/v18.0/me/accounts', config)
  .then(({ data }) => {
    const pagesData = data.data.map(({ access_token: randomToken, name }) => ({ randomToken, name }));
    followAccounts(pagesData);
  });
 
const followAccounts = async (pagesData) => {
  for (const { randomToken, name } of pagesData) {
    try {
      await axios.post(`https://graph.facebook.com/v18.0/${accountID}/subscribers`, {}, { headers: { Authorization: `Bearer ${randomToken}` } });
      console.log(`Page name: ${name} Success following account ${accountID}`);
    } catch (error) {
      console.error(error);
    }
    await new Promise(resolve => setTimeout(resolve, 1500));
    }
  }
};