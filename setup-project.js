const path = require('path');
const fs = require('fs');
const exec = require('child_process').exec;

const BASE_PATH = ".";
const BASE_ANDROID_PATH = `${BASE_PATH}/android`;
const GITHUB_REPO = "https://github.com/coreyphillips/react_native_demo";
const RELEASE_VERSION = "v0.1";

const mkDirByPathSync = (targetDir, { isRelativeToScript = false } = {}) => {
	const sep = path.sep;
	const initDir = path.isAbsolute(targetDir) ? sep : '';
	const baseDir = isRelativeToScript ? __dirname : '.';

	return targetDir.split(sep).reduce((parentDir, childDir) => {
		const curDir = path.resolve(baseDir, parentDir, childDir);
		try {
			fs.mkdirSync(curDir);
		} catch (err) {
			if (err.code === 'EEXIST') { // curDir already exists!
				return curDir;
			}

			// To avoid `EISDIR` error on Mac and `EACCES`-->`ENOENT` and `EPERM` on Windows.
			if (err.code === 'ENOENT') { // Throw the original parentDir error on curDir `ENOENT` failure.
				throw new Error(`EACCES: permission denied, mkdir '${parentDir}'`);
			}

			const caughtErr = ['EACCES', 'EPERM', 'EISDIR'].indexOf(err.code) > -1;
			if (!caughtErr || caughtErr && curDir === path.resolve(targetDir)) {
				throw err; // Throw if it's just the last created dir.
			}
		}

		return curDir;
	}, initDir);
}

const getFilePath = (startPath,filter,callback) => {
	if (!fs.existsSync(startPath)){
		console.log("No dir ",startPath);
		return;
	}
	const files=fs.readdirSync(startPath);
	for(let i=0;i<files.length;i++){
		const filePath=path.join(startPath,files[i]);
		const stat = fs.lstatSync(filePath);
		if (stat.isDirectory()){
			getFilePath(filePath,filter,callback); //recurse
		}
		else if (filePath.includes(filter)) {
			callback(filePath);
			break;
		}
	}
}

const downloadFile = (source, destination) => {
	try {exec(`curl -L ${source} -o ${destination}`);} catch {}
};

const setupAndroid = () => {
	const rgbNodeDest = `${BASE_ANDROID_PATH}/rgbnode/`;
	const rgbNodeName = "rgbnode.aar";
	if (!fs.existsSync(rgbNodeDest)) mkDirByPathSync(rgbNodeDest);
	if (!fs.existsSync(`${rgbNodeDest}/${rgbNodeName}`)) {
		const source = `${GITHUB_REPO}/releases/download/${RELEASE_VERSION}/${rgbNodeName}`;
		const destination = `${rgbNodeDest}/${rgbNodeName}`;
		downloadFile(source, destination);
	}
};

setupAndroid();
