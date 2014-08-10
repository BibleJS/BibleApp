#!/usr/bin/env node

// Help output
const HELP =
"bible --help"
+ "\nusage: bible [options] [reference1, reference2, ...]"
+ "\n"
+ "\nCLI client for bible.js NPM module. Read the Holy Bible via command line"
+ "\n"
+ "\noptions:"
+ "\n  --v, --version          print the version"
+ "\n  --lang, --language      set the Bible language"
+ "\n  --onlyVerses            prevent showing additional outpt"
+ "\n  --s, --search           get the verses that match to the string or"
+ "\n                          regular expression provided"
+ "\n  --rc, --resultColor     set the result color when searching something"
+ "\n  --help                  print this output"
+ "\n"
+ "\nreferences:"
+ "\n - References separated by spaces (see example):"
+ "\n"
+ "\nexample:"
+ "\n   bible --lang en 'John 1:1-10' 'Genesis 2:3-7'"
+ "\n   bible --lang ro --search 'Meroza'"
+ "\n   bible --lang ro --search '/Meroza/gi'"
+ "\n"
+ "\nWhen the module is initialized, the packages listed in configuration file,"
+ "\nare downloaded and used (~/.bible directory).  The configuration is stored"
+ "\nin a JSON file, in the home directory: ~/.bible-config.json"
+ "\n"
+ "\nIf this doesn't exist, it's created at the first `bible` call."
+ "\n"
+ "\nYou can create custom packages, including them there (in  the `versions`"
+ "\nfield). The additional configuration fields are listed below:"
+ "\n"
+ "\n - `language`: a string representing the default language (if this is set,"
+ "\n               `--lang`  is not needed anymore unless you want to override"
+ "\n               the language value)"
+ "\n"
+ "\n - `resultColor`: a string  representing  the  default  result color  when"
+ "\n                  searching    something   (if  this  is  set,  `--rc`  or"
+ "\n                  `--resultColor`  options are not needed anymore unless"
+ "\n                  you want to override the `resultColor` value)"
+ "\n"
+ "\n - `searchLimit`: an integer representing max number of verses that will be"
+ "\n                  output when searching something"
+ "\n"
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
  , resultColor: "255, 0, 0"
  , searchLimit: 10
  , language: /^ro_/.test(process.env.LC_NAME) ? "ro" : "en"
  , searchLimit: 10
};

const CONFIG_FILE_PATH = HOME_DIRECTORY + "/.bible-config.json";

// Dependencies
var Bible = require("bible.js")
  , Couleurs = require("couleurs")
  , Debug = require("bug-killer")
  , RegexParser = require("regex-parser").parse
  , Yargs = require("yargs").usage(HELP)
  , argv = Yargs.argv
  , language = argv.lang || argv.language
  , search = argv.s || argv.search
  , searchResultColor = null
  , OS = require("os")
  , LeTable = require("le-table")
  , Fs = require("fs")
  , config = null
  ;

  debugger;
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
    argv.rc || argv.resultColor || config.resultColor
).split(",")
config.searchLimit = config.searchLimit || 10;

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

var references = argv._;
// Show help
if (argv.help ||  (!language && !references.length && !search)) {
    return console.log(Yargs.help());
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

            // Highlight search results
            var re = typeof search === "string" ? RegexParser(search) : search
              , match = cVerse.text.match(re) || []
              ;

            for (var ii = 0; ii < match.length; ++ii) {
                cVerse.text = cVerse.text.replace (
                    new RegExp(match[ii])
                  , match[ii].rgb(searchResultColor)
                );
            }
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

        // Search limit
        if (search && --config.searchLimit <= 0) {
            break;
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
    if (references.length) {
        for (var i = 0; i < references.length; ++i) {
            (function (cR) {
                if (!argv.onlyVerses) {
                    console.log("Reference: " + cR);
                }
                bibleIns.get(cR, printOutput);
            })(references[i]);
        }
    }

    // Search verses
    if (search) {
        if (!argv.onlyVerses) {
            console.log("Results for search: " + search);
        }
        bibleIns.search(search, printOutput);
    }
});
