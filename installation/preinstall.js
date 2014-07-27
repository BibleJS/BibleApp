#!/usr/bin/env node

// Dependencies
var Fs = require("fs");

function getUserHome() {
    return process.env[(process.platform == 'win32') ? 'USERPROFILE' : 'HOME'];
}

console.log("Creating configuration file ...")
Fs.writeFileSync(getUserHome() + "/" + ".bible-config.json", JSON.stringify(
    require("./sample-config"), null, 4
));
