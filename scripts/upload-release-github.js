const path = require("path");
const { Console } = require("console-pro");
const { spawn } = require("child_process");
const { writeFileSync, readFileSync } = require("fs");
const node_module_path = path.resolve(
	path.join(__dirname, "..", "node_modules")
);
const console = new Console();
const pkg = require("../package.json");

process.env.GITHUB_TOKEN = readFileSync(
	path.join(__dirname, ".github-release-github-token")
).toString();
process.env.GITHUB_USER = pkg.author;
process.env.GITHUB_REPO = pkg.name;

async function getVersion() {
	const info = await new Promise((resolve, reject) => {
		const $info = spawn("github-release", [
			"info",
			// "-u",
			// "Gaubee",
			// "-r",
			// "MyBlog",
			"-j"
		]);
		var normal_output = "";
		var error_output = "";
		$info.stdout.on("data", data => {
			data = data.toString();
			normal_output += data;
			data = data.split("\n");
			if (data[data.length - 1] === "") {
				data.pop();
			}
			data = data.join("\n");
			// console.log(data);
		});
		$info.stderr.on("data", data => {
			error_output += data;
		});
		$info.on("close", code => {
			// console.info(`child process exited with code ${code}`);
			if (error_output.length) {
				reject(new Error("BUILD FAIL\n" + error_output));
			} else {
				resolve(JSON.parse(normal_output));
			}
		});
	});
	const cur_version = pkg.version || "0.0.0";
	const version_info = cur_version.split(".");

	if (info.Releases.find(rel => rel.tag_name === "v" + cur_version)) {
		// 已经拥有这个版本号的发布版本，
		// 修改package.json的小号版本
		version_info[version_info.length - 1] =
			(version_info[version_info.length - 1] | 0) + 1;
		pkg.version = version_info.join(".");
		writeFileSync(
			path.join(__dirname, "..", "package.json"),
			JSON.stringify(pkg, null, 2)
		);
		console.flag("VERSION AUTO INCREASE", cur_version, "==>", pkg.version);
	}
	return pkg.version;
}
exports.getVersion = getVersion;

exports.release_and_upload = async function release_and_upload(
	name,
	tag_name,
	file_path
) {
	await new Promise((resolve, reject) => {
		const $release = spawn("github-release", [
			"release",
			"-n",
			name,
			"-t",
			tag_name
		]);
		var normal_output = "";
		var error_output = "";
		$release.stdout.on("data", data => {
			data = data.toString();
			normal_output += data;
			data = data.split("\n");
			if (data[data.length - 1] === "") {
				data.pop();
			}
			data = data.join("\n");
			console.log(data);
		});
		$release.stderr.on("data", data => {
			error_output += data;
		});
		$release.on("close", code => {
			if (error_output.length) {
				reject(new Error("RELEASE FAIL\n" + error_output));
			} else {
				console.flag("Created RELEASE", tag_name);
				resolve(normal_output);
			}
		});
	});
	if (!file_path) {
		return;
	}
	await new Promise((resolve, reject) => {
		const args = ["upload", "-n", name, "-t", tag_name, "-f", file_path];

		const $upload = spawn("github-release", args);
		var normal_output = "";
		var error_output = "";
		$upload.stdout.on("data", data => {
			data = data.toString();
			normal_output += data;
			data = data.split("\n");
			if (data[data.length - 1] === "") {
				data.pop();
			}
			data = data.join("\n");
			console.log(data);
		});
		$upload.stderr.on("data", data => {
			error_output += data;
		});
		$upload.on("close", code => {
			if (error_output.length) {
				reject(new Error("UPLOAD FAIL\n" + error_output));
			} else {
				console.flag("Uploaded RELEASE downloader", tag_name);
				resolve(normal_output);
			}
		});
	});
};
