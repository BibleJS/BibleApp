#!/usr/bin/env node

// Dependencies
var RimRaf = require("rimraf");

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

console.log("Deleting ~/.bible directory");
RimRaf.sync(getUserHome() + "/.bible");

console.log("Deleting ~/.bible-config.json configuration file");
RimRaf.sync(getUserHome() + "/.bible-config.json");
