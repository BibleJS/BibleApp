#!/usr/bin/env node

// Dependencies
var Bible = require("bible.js");

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

// Install submodules
console.log("Downloading and installing BibleJS submodules ...")
Bible.init(require(getUserHome() + "/.bible-config.json"), function (err) {
    if (err) { throw err; }
    console.log("Done.");
});
