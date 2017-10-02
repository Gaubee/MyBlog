const prpl = require("prpl-server");
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();

const build_root = path.join(__dirname, "build");
const build_config = JSON.parse(
	fs.readFileSync(path.join(build_root, "polymer.json"))
);
console.log(build_root, build_config);

app.get("/*", prpl.makeHandler(build_root, build_config));

app.listen(8080);
