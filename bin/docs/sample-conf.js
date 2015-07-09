module.exports = {
    versions: {
        en: {
            source: "https://github.com/BibleJS/bible-english"
          , version: "master"
          , language: "en"
        },
        ro: {
            source: "https://github.com/BibleJS/bible-romanian"
          , version: "master"
          , language: "ro"
        }
    }
  , resultColor: "255, 0, 0"
  , language: /^ro_/.test(process.env.LC_NAME) ? "ro" : "en"
  , searchLimit: 10
};
