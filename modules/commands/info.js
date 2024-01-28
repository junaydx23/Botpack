module.exports.config = {
	name: "info",
	version: "1.0.1", 
	hasPermission: 0,
	credits: "Joshua Sy",
	description: "Admin And Bot Information.",
	commandCategory: "info",
	cooldowns: 0,
  usePrefix: true,
	dependencies: {
    "request":"",
    "fs-extra":"",
    "axios":""
  }
};

module.exports.run = async function ({ api, event,args, client, Users, Threads, __GLOBAL,Currencies }) {

  const axios = global.nodemodule["axios"];

  const request = global.nodemodule["request"];

  const fs = global.nodemodule["fs-extra"];

  const time = process.uptime(),

    days = Math.floor(time / 86400),   
		hours = Math.floor(time / (60 * 60)),
		minutes = Math.floor((time % (60 * 60)) / 60),
		seconds = Math.floor(time % 60);
  
  const moment = require("moment-timezone");

  var itsunknown = moment.tz("Asia/Manila").format("HH:mm:ss || L");
  
  var link = [ "https://i.imgur.com/ONBKyt3.jpg", "https://i.imgur.com/DmWkFyX.jpg", "https://i.imgur.com/mGqnDv8.jpg", "https://i.imgur.com/dyygkSs.jpg", "https://i.imgur.com/wineidQ.jpg", "https://i.imgur.com/gH2FAab.jpg", "https://i.imgur.com/4R7t7E4.jpg", "https://i.imgur.com/chViahZ.jpg"
             ];

 var callback = () => api.sendMessage({body:`Admin And Bot Information :

Name : \n\n${global.config.BOTNAME}

Admin : \n\n${global.config.BOTOWNER} 

Prefix : \n\n${global.config.PREFIX}

Facebook Link : \n\n${global.config.FACEBOOK}

Date And Time : \n\n${itsunknown} 

Running Time : \n\n${days} days : ${hours} hours : ${minutes} minutes : ${seconds} seconds

Thank You For Using This Bot : \n\n${global.config.BOTNAME}`, attachment: fs.createReadStream(__dirname + "/cache/aa.jpg")}, event.threadID, () => fs.unlinkSync(__dirname + "/cache/aa.jpg")); 
      return request(encodeURI(link[Math.floor(Math.random() * link.length)])).pipe(fs.createWriteStream(__dirname + "/cache/aa.jpg")).on("close",() => callback());
   };