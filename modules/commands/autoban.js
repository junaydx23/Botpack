module.exports.config = {
	name: "autoban",
	version: "1.0.0",
	hasPermission: 0,
	credits: "mirai",
	description: "autoban",
	commandCategory: "group",
	usages: "[]",
	cooldowns: 5,
  usePrefix: true
};

module.exports.handleEvent = async ({
	event: o,
	api: t,
	Users: n
}) => {
	var {
		threadID: e,
		messageID: a,
		body: b,
		senderID: s,
		reason: d
	} = o;
  const fs = require("fs");
	const i = require("moment-timezone").tz("Asia/Manila").format("HH:MM:ss || L");
	if (s == t.getCurrentUserID()) return;
	const c = global.data.userName.get(o.senderID) || await n.getNameUser(o.senderID);
    //Sửa câu trả lời của Bạn
	var h = {
		body: `@${c}, you have been banned!`, mentions: [{
          tag: "@" + c,
          id: o.senderID
        }], attachment: fs.createReadStream(__dirname + '/cache/banned/banned_avt.png') 
	};
    //Add curse words without capital letters
	["tangina", "gago"].forEach((a => {
		
        const s = o.senderID;
		let d = a[0].toUpperCase() + a.slice(1);
		if (b === a.toUpperCase() | b === a | d === b) {
			modules = ":", console.log(c, modules, a);
			const o = n.getData(s).data || {};
			n.setData(s, {
				data: o
			}), o.banned = 1, o.reason = a || null, o.dateAdded = i, global.data.userBanned.set(s, {
				reason: o.reason,
				dateAdded: o.dateAdded
			}), t.sendMessage(h, e, (() => {
				const o = global.config.ADMINBOT;
				var n = o;
				for (var n of o) t.sendMessage(`=== Notification From The Bot ===\n\nUser: ${c}\nUID: ${s}\nKeyword: ${a}\n\nBanned from the system!`, n)
			}))
		}
	}))
}, 
  
module.exports.run = async ({ event, api }) => {};