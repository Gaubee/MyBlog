const { Console } = require("console-pro");
const { spawn } = require("child_process");
const util = require("util");
const zipFolder = util.promisify(require("zip-folder"));
const path = require("path");
const project_path = path.resolve(path.join(__dirname, ".."));
const node_module_path = path.resolve(
	path.join(__dirname, "..", "node_modules")
);
const console = new Console();

exports.build = function build() {
	const g1 = console.group("BUILD");
	const $build = spawn("node", [
		path.resolve(
			path.join(node_module_path, "polymer-cli", "bin", "polymer.js")
		),
		"build"
	]);
	return new Promise((resolve, reject) => {
		var normal_output = "";
		var error_output = "";
		$build.stdout.on("data", data => {
			data = data.toString();
			normal_output += data;
			data = data.split("\n");
			if (data[data.length - 1] === "") {
				data.pop();
			}
			data = data.join("\n");
			console.log(data);
		});
		$build.stderr.on("data", data => {
			error_output += data;
		});
		$build.on("close", code => {
			console.info(`child process exited with code ${code}`);
			if (error_output.length) {
				reject(error_output);
				new Error("Get github-release info FAIL\n" + error_output);
			} else {
				resolve(normal_output);
			}
			console.groupEnd(g1);
		});
	});
};
exports.pkgBuild = function packageBuild(filename = "build") {
	const zip_path = path.resolve(path.join(project_path, filename + ".zip"));
	return zipFolder(
		path.resolve(path.join(project_path, "build")),
		zip_path
	).then(() => zip_path);
};
