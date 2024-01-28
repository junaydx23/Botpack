module.exports.config = {
  name: "gotranslate",
  version: "1.0.0",
  hasPermission: 0,
  credits: "August Quinn",
  description: "Translate text and get audio pronunciation",
  commandCategory: "media",
  usages: "gotranslate [language_from] => [language_to] [text]",
  cooldowns: 5,
  usePrefix: true,
  dependencies: {
    "path": "",
    "fs-extra": ""
  }
};

module.exports.run = async function({ api, event, args }) {
  const axios = require("axios");
  try {
    const { createReadStream, unlinkSync } = global.nodemodule["fs-extra"];
    const { resolve } = global.nodemodule["path"];
    var content = (event.type == "message_reply") ? event.messageReply.body : args.join(" ");

    if (!content || content === "gotranslate") {

      const languageList = [
        "af => Afrikaans",
        "sq => Albanian",
        "ar => Arabic",
        "bn => Bengali",
        "bs => Bosnian",
        "bg => Bulgarian",
        "ca => Catalan",
        "zh => Chinese",
        "hr => Croatian",
        "cs => Czech",
        "da => Danish",
        "nl => Dutch",
        "en => English",
        "et => Estonian",
        "tl => Filipino",
        "fi => Finnish",
        "fr => French",
        "de => German",
        "el => Greek",
        "gu => Gujarati",
        "he => Hebrew",
        "hi => Hindi",
        "hu => Hungarian",
        "is => Icelandic",
        "id => Indonesian",
        "it => Italian",
        "ja => Japanese",
        "jw => Javanese",
        "kn => Kannada",
        "km => Khmer",
        "ko => Korean",
        "la => Latin",
        "lv => Latvian",
        "ms => Malay",
        "ml => Malayalam",
        "mr => Marathi",
        "my => Burmese",
        "ne => Nepali",
        "no => Norwegian",
        "nb => Norwegian Bokmål",
        "pl => Polish",
        "pt => Portuguese",
        "pa => Punjabi",
        "ro => Romanian",
        "ru => Russian",
        "sk => Slovak",
        "sr => Serbian",
        "si => Sinhala",
        "es => Spanish",
        "su => Sundanese",
        "sw => Swahili",
        "sv => Swedish",
        "ta => Tamil",
        "te => Telugu",
        "th => Thai",
        "tr => Turkish",
        "uk => Ukrainian",
        "ur => Urdu",
        "vi => Vietnamese",
      ];

      const languageText = "LIST OF THE SUPPORTED LANGUAGE: \n\n" + languageList.join("\n");
      return api.sendMessage(languageText, event.threadID);
    }

    const languageRegex = /^([a-z]{2}) => ([a-z]{2}) (.+)/i;
    const match = content.match(languageRegex);

    if (!match) {
      return api.sendMessage("Invalid format!\n\ngotranslate [language_from] => [language_to] [text]", event.threadID);
    }

    const languageFrom = match[1];
    const languageTo = match[2];
    const textToTranslate = match[3];

    // Use Google Translate API to get the translation
    const translateAPI = "https://translate.googleapis.com/translate_a/single";
    const params = {
      client: "gtx",
      sl: languageFrom,
      tl: languageTo,
      dt: "t",
      q: textToTranslate,
    };

    const response = await axios.get(translateAPI, { params });
    const translationResult = response.data[0][0][0];

    const path = resolve(__dirname, 'cache', `${event.threadID}_${event.senderID}.mp3`);
    await global.utils.downloadFile(`https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(translationResult)}&tl=${languageTo}&client=tw-ob`, path);

    const translatedText = `GOTRANSLATE\n\n➤ Translated ${languageFrom} to ${languageTo}\n\n▣  “${translationResult}”`;
    api.sendMessage({ attachment: createReadStream(path) }, event.threadID, () => unlinkSync(path));
    return api.sendMessage(translatedText, event.threadID);
  } catch (e) { return console.log(e) };
};