import rimraf from "rimraf"
import webpackPaths from "../configs/webpack.paths"
import process from "process"

const args = process.argv.slice(2)
const commandMap = {
	dist: webpackPaths.distPath,
	release: webpackPaths.releasePath,
	dll: webpackPaths.dllPath,
}

args.forEach((arg) => {
	// assume arg is one of dist, release, or dll
	// @ts-ignore
	const pathToRemove = commandMap[arg]
	if (pathToRemove !== undefined) {
		rimraf.sync(pathToRemove)
	}
})
