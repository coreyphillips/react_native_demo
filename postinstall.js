var exec = require("child_process").exec;
var os = require("os");

const generalCmd = exec(
	""
);

function postInstallMac() {
	//exec(`${generalCmd}`);
	exec(`cd ios && pod install && cd ..`);
}
function postInstallLinWin() {
	//exec(`${generalCmd}`);
}

if (os.type() === "Darwin")
	postInstallMac();
else
	postInstallLinWin();
