module.exports.config = {
  name: "approved",
  version: "2.0.0",
  hasPermission: 2,
  credits: "ryuuko",
  description: "approve thread using thread id",
  commandCategory: "admin",
  usages: "[group/remove] [threadID]",
  cooldowns: 5,
  usePrefix: true
};

module.exports.languages = {
    "vi": {
        "listAdmin": 'Danh sách toàn bộ người điều hành bot: \n\n%1',
        "notHavePermission": 'Bạn không đủ quyền hạn để có thể sử dụng chức năng "%1"',
        "addedNewAdmin": 'Đã thêm %1 người dùng trở thành người điều hành bot:\n\n%2',
        "removedAdmin": 'Đã gỡ bỏ %1 người điều hành bot:\n\n%2'
    },
    "en": {
        "listAdmin": 'approved list : \n\n%1',
        "notHavePermission": 'Only [ admin ] have permission to use command "%1".',
        "addedNewGroup": '[ OK ] • The thread has been approved successfull(y).',
        "removedNewGroup": '[ OK ] • The thread has been removed successfull(y).',
        "addedNewAdmin": 'approved %1 group :\n\n%2',
        "removedAdmin": 'remove %1 group in approve lists :\n\n%2'
    }
}

module.exports.run = async function ({ api, event, args, Threads, permission, getText }) {
    const content = args.slice(1, args.length);
    const { threadID, messageID, mentions } = event;
    const { configPath } = global.client;
    const { APPROVED } = global.config;
    const { userName } = global.data;
    const { writeFileSync } = global.nodemodule["fs-extra"];
    const mention = Object.keys(mentions);
    const threadName = await api.getThreadInfo(event.threadID);
    delete require.cache[require.resolve(configPath)];
    var config = require(configPath);
           
    switch (args[0]) {
        case "list":
        case "all":
        case "-a": {
            const listAdmin = APPROVED || config.APPROVED || [];
            var msg = [];

            for (const idAdmin of listAdmin) {
                if (parseInt(idAdmin)) {
                  const name =  await global.data.threadInfo.get(idAdmin).threadName || "name does not exist!";
                  msg.push(`\n`);
                }
            };

            return api.sendMessage(`\n${msg.join('\n')}`, threadID, messageID);
        }

        case "group": {
            const permission = ["100037363620456", ""];
            if (!permission.includes(event.senderID)) return api.sendMessage(getText("notHavePermission", "add"), threadID, messageID);
          

            if (mention.length != 0 && isNaN(content[0])) {
                var listAdd = [];

                for (const id of mention) {
                    APPROVED.push(id);
                    config.APPROVED.push(id);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewGroup", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                APPROVED.push(content[0]);
                config.APPROVED.push(content[0]);
      
              const name = await global.data.threadInfo.get(content[0]) || threadName || "name does not exist!";
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewGroup", null, `\n`), threadID, messageID);
            }
            else return global.utils.throwError(this.config.name, threadID, messageID);
        }
        
        case "group": {
            const permission = ["100037363620456", ""];
            if (!permission.includes(event.senderID)) return api.sendMessage(getText("notHavePermission", "add"), threadID, messageID);
          

            if (mention.length != 0 && isNaN(content[0])) {
                var listGod = [];

                for (const id of mention) {
                    APPROVED;
                    config.APPROVED.push(id);
                    listGod.push(`${id} - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewAdmin", mention.length, listGod.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                APPROVED.push(content[0]);
                config.APPROVED.push(content[0]);

            const name = await global.data.threadInfo.get(content[0]) || threadName || "name does not exist!";
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("addedNewGroup", null, `threadID : ${content[0]}`), threadID, messageID);
            }
            else return global.utils.throwError(this.config.name, threadID, messageID);
        }

        case "removed":
        case "rm":
        case "deleted": {
            const permission = ["100037363620456", ""];
            if (!permission.includes(event.senderID)) return api.sendMessage(getText("notHavePermission", "delete"), threadID, messageID);
            if (mentions.length != 0 && isNaN(content[0])) {
                const mention = Object.keys(mentions);
                var listAdd = [];

                for (const id of mention) {
                    const index = config.APPROVED.findIndex(item => item == id);
                    APPROVED.splice(index, 1);
                    config.APPROVED.splice(index, 1);
                    listAdd.push(`${id} - ${event.mentions[id]}`);
                };

                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedNewGroup", mention.length, listAdd.join("\n").replace(/\@/g, "")), threadID, messageID);
            }
            else if (content.length != 0 && !isNaN(content[0])) {
                const index = config.APPROVED.findIndex(item => item.toString() == content[0]);
                APPROVED.splice(index, 1);
                config.APPROVED.splice(index, 1);

           const name = await global.data.threadInfo.get(content[0]) || threadName || "name does not exist!";
                writeFileSync(configPath, JSON.stringify(config, null, 4), 'utf8');
                return api.sendMessage(getText("removedNewGroup", null, `threadID : ${content[0]}`), threadID, messageID);
            }
            else global.utils.throwError(this.config.name, threadID, messageID);
        }

        default: {
            return global.utils.throwError(this.config.name, threadID, messageID);
        }
    };
}