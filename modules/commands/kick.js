module.exports.config = {
	name: "kick",
	version: "1.0.1", 
	hasPermission: 2,
	credits: "Mirai Team",
	description: "Clear the person you need to remove from the group by tag",
	commandCategory: "System", 
	usages: "[tag]", 
	cooldowns: 0,
  usePrefix: true
};

module.exports.languages = {
	"vi": {
		"error": "Đã có lỗi xảy ra, vui lòng thử lại sau",
		"notHavePermission": "Cần quyền quản trị viên nhóm\nVui lòng thêm và thử lại!",
		"missingTag": "Bạn phải tag người cần kick"
	},
	"en": {
		"error": "Error! An error occurred. Please try again later!",
		"notHavePermission": "Need group admin\nPlease add and try again!",
		"missingTag": "You need tag some person to kick"
	}
}

module.exports.run = async function({ api, event, getText, Threads }) {
        if (event.type === 'message_reply') {
        const uid = event.messageReply.senderID;
      setTimeout(() => {
                                api.removeUserFromGroup(uid, event.threadID);
          return uid;
           }, 1000);
        }
    const mention = Object.keys(event.mentions);
    try {
        let dataThread = (await Threads.getData(event.threadID)).threadInfo;
        if (!dataThread.adminIDs.some(item => item.id == api.getCurrentUserID())) {
            return api.sendMessage(getText("notHavePermission"), event.threadID, event.messageID);
        }
          
        if (!mention[0]) {
            return api.sendMessage("Tag/reply someone to kick out of this group.", event.threadID, event.messageID);
        }
        if (dataThread.adminIDs.some(item => item.id == event.senderID)) {
            for (const o in mention) {
                setTimeout(() => {
                                api.removeUserFromGroup(mention[o], event.threadID);
                }, 1000);
            }
        }
    } catch {
        return api.sendMessage(getText("error"), event.threadID);
    }
}