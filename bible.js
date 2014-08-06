#!/usr/bin/env node

// Help output
const HELP =
"bible --help"
+ "\nusage: bible [options]"
+ "\n"
+ "\nRead the Holy Bible using a NPM application."
+ "\n"
+ "\noptions:"
+ "\n  --v, --version          print the version"
+ "\n  --lang, --language      set the Bible language"
+ "\n  --ref, --reference      the verse references that you want to read"
+ "\n  --onlyVerses            prevent showing additional output"
+ "\n  --s, --search           get the verses that match to the string or"
+ "\n                          regular expression provided"
+ "\n  --rc, --resultColor     set the result color when searching something"
+ "\n  --help                  print this output"
+ "\n"
+ "\nDocumentation can be found at https://github.com/BibleJS/BibleApp";

// Constants
const HOME_DIRECTORY = process.env[
    process.platform == "win32" ? "USERPROFILE" : "HOME"
];
const SAMPLE_CONFIGURATION = {
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
};
const CONFIG_FILE_PATH = HOME_DIRECTORY + "/.bible-config.json";

// Dependencies
var Bible = require("bible.js")
  , Couleurs = require("couleurs")
  , Debug = require("bug-killer")
  , Yargs = require("yargs").usage(HELP)
  , argv = Yargs.argv
  , language = argv.lang || argv.language
  , reference = argv.reference || argv.ref
  , search = argv.s || argv.search
  , searchResultColor = null
  , OS = require("os")
  , LeTable = require("le-table")
  , Fs = require("fs")
  , config = null
  ;

// Read configuration file
try {
    config = require(CONFIG_FILE_PATH);
} catch (e) {
    if (e.code === "MODULE_NOT_FOUND") {
        Debug.log(
            "No configuration file was found. Initing configuration file."
          , "warn"
        );
        Fs.writeFileSync(CONFIG_FILE_PATH, JSON.stringify(
            SAMPLE_CONFIGURATION, null, 4
        ));
        Debug.log(
            "Configuration file created successfully at the following location: "
          + CONFIG_FILE_PATH
          , "warn"
        );
        config = require(CONFIG_FILE_PATH);
    } else {
        Debug.log(
            "Cannot read configuration file. Reason: " + e.code
          , "warn"
        );
    }
}

// Try to get options from config as well
language = language || config.language;
searchResultColor = (
    argv.rc || argv.resultColor || config.resultColor || "255, 0, 0"
).split(",")

// Table defaults
LeTable.defaults.marks = {
    nw: "┌"
  , n:  "─"
  , ne: "┐"
  , e:  "│"
  , se: "┘"
  , s:  "─"
  , sw: "└"
  , w:  "│"
  , b: " "
  , mt: "┬"
  , ml: "├"
  , mr: "┤"
  , mb: "┴"
  , mm: "┼"
};

// Parse result color
for (var i = 0; i < 3; ++i) {

    if (!searchResultColor[i]) {
        return console.log(
            "Invalid result color. Please provide a string in this format:"
          + "'r, g, b'. Example: --resultColor '255, 0, 0'"
        );
    }

    searchResultColor[i] = parseInt(searchResultColor[i])
}

// Show version
if (argv.v || argv.version) {
    return console.log("Bible.js v" + require("./package").version);
}

// Show help
if (argv.help || !language || (!reference && !search)) {
    return console.log(Yargs.help());
}

// Output
if (!argv.onlyVerses) {
    if (reference) {
        console.log("You are reading " + reference);
    }

    if (search) {
        console.log("You are searching " + search);
    }

    console.log("----------------");
}

/**
 * printOutput
 * This function is called when the response from the
 * search or get request comes
 *
 * @param {Error} err An error that ocured while fetching the verses.
 * @param {Array} verses The verses array that was returned by bible.js module.
 * @return {undefined} Returns undefined
 */
function printOutput (err, verses) {

    // Handle error
    if (err) {
        console.log("Error: ", err);
        return;
    }

    // No verses
    if (!verses || !verses.length) {
        console.log("Verses not found");
    }

    var tbl = new LeTable();

    // Output each verse
    for (var i in verses) {

        // get the current verse and its reference
        var cVerse = verses[i]
          , cVerseRef = cVerse.bookname + " " + cVerse.chapter + ":" + cVerse.verse
          ;

        if (search) {
            cVerse.text = cVerse.text.replace (
                new RegExp (search, "g")
              , search.rgb(searchResultColor)
            );
        }

        if (argv.onlyVerses) {
            console.log(cVerse.text);
        } else {
            tbl.addRow([
                {text: cVerseRef, data: {hAlign: "right"}}
              , {
                    text: cVerse.text.match(/.{1,80}(\s|$)|\S+?(\s|$)/g).join("\n")
                  , data: {hAlign: "left"}
                }
            ]);
        }
    }

    // Output
    if (!argv.onlyVerses) {
        console.log(tbl.toString());
    }
}

// Init submodules
Bible.init(config, function (err) {

    if (err) { throw err; }

    // Create Bible instance
    var bibleIns = new Bible({language: language});

    // Get the verses
    if (reference) {
        bibleIns.get(reference, printOutput);
    }

    // Search verses
    if (search) {
        bibleIns.search(search, printOutput);
    }
});
