module.exports.config = {
	name: "autosharev2",
	version: "1.0.0",
	hasPermission: 0,
	credits: "rickciel",
	description: "autoshare",
	commandCategory: "social",
	usages: "[]",
	cooldowns: 5,
  usePrefix: true
};

module.exports.run = async ({ api, event, args }) => {

  const { threadID, messageID } = event;
  const axios = require('axios');
  
  try {
    if (args.length !== 3) {
      api.sendMessage('Error! \n\nUsage: _autoshare [token] [url] [amount]', threadID);
      return;
    }

    const accessToken = args[0];
    const sharedUrl = args[1];
    const sharedAmount = parseInt(args[2]);

    if (isNaN(sharedAmount) || sharedAmount <= 0) {
      api.sendMessage('Invalid share amount. Please provide a valid positive number.', threadID);
      return;
    }

    const timeInterval = 1000;
    const deleteAfter = 60 * 60;

    let sharedCount = 0;
    let timer = null;

    async function sharedPost() {
      try {
        const response = await axios.post(
          `https://graph.facebook.com/me/feed?access_token=${accessToken}&fields=id&limit=1&published=0`,
          {
            link: sharedUrl,
            privacy: { value: 'SELF' },
            no_story: true,
          },
          {
            muteHttpExceptions: true,
            headers: {
              authority: 'graph.facebook.com',
              'cache-control': 'max-age=0',
              'sec-ch-ua-mobile': '?0',
              'user-agent':
                'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.97 Safari/537.36',
            },
            method: 'post',
          }
        );

        sharedCount++;
        const postID = response.data.id;

        console.log(`Post shared: ${sharedCount}`);
        console.log(`Post ID: ${postID || 'Unknown'}`);

        if (sharedCount === sharedAmount) {
          clearInterval(timer);
          console.log('Finished sharing posts.');

          if (postID) {
            setTimeout(() => {
              deletePost(postID);
            }, deleteAfter * 1000);
          }
        }
      } catch (error) {
        console.error('Failed to share post:', error.response.data);
      }
    }

    async function deletePost(postID) {
      try {
        await axios.delete(`https://graph.facebook.com/${postID}?access_token=${accessToken}`);
        console.log(`Post deleted: ${postID}`);
      } catch (error) {
        console.error('Failed to delete post:', error.response.data);
      }
    }

    timer = setInterval(sharedPost, timeInterval);

    setTimeout(() => {
      clearInterval(timer);
      //console.log('Loop stopped.');
      api.sendMessage('Process complete successfully.', threadID);
    }, sharedAmount * timeInterval);
  } catch (error) {
    console.error('Error:', error);
    api.sendMessage('An error occurred: ' + error.message, threadID);
  }
};