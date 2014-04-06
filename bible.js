#!/usr/bin/env node

const HELP =
"bible --help" +
"\nusage: bible [options]" +
"\n" +
"\nRead the Holy Bible using a NPM application." +
"\n" +
"\noptions:" +
"\n  --v, --version          print the version" +
"\n  --lang, --language      set the Bible language" +
"\n  --ref, --reference      the verse references that you want to read" +
"\n  --help                  print this output" +
"\n" +
"\nDocumentation can be found at https://github.com/BibleJS/BibleApp";


// dependencies
var Bible = require ("bible.js")
  , Yargs = require('yargs').usage(HELP)
  , argv = Yargs.argv
  , language = argv.lang || argv.language
  , reference = argv.reference || argv.ref
  ;

if (argv.v || argv.version) {
    return console.log(require ("./package").version);
}

if (argv.help || !language || !reference) {
    return console.log(Yargs.help());
}


console.log("You are reading " + reference);
console.log("----------------");

// get the verses
(new Bible({language: language})).get(reference, function (err, verses) {

    // handle error
    if (err) {
        console.log("Error: ", err);
        return;
    }

    // no verses
    if (!verses || !verses.length) {
        console.log("Verses not found");
    }

    // output each verse
    for (var i in verses) {
        var cVerse = verses[i];
        console.log(cVerse.bookname + " " + cVerse.chapter + ":" + cVerse.verse + " | " + cVerse.text);
    }
    console.log("----------------");
});
