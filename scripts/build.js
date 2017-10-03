const { Console } = require("console-pro");
const { build, pkgBuild } = require("./polymer-build");
const { getVersion, release_and_upload } = require("./upload-release-github");
const console = new Console();

async function run() {
	await build();
	console.success("[Build DONE]");

	const download_filepath = await pkgBuild();
	console.success("[Package zip DONE]", download_filepath);

	const version = await getVersion();
	console.success("[Get Version DONE]", version);

	await release_and_upload("PRPL-version.zip", "v" + version, download_filepath);
	console.success("[Upload zip DONE]", version);
}
run().catch(err => console.error(err));
