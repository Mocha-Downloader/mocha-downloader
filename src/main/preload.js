/**
 * @file Exposes api to the front end without compromising security.
 * More information can be found [here](https://www.electronjs.org/docs/latest/tutorial/context-isolation) and [here](https://github.com/reZach/secure-electron-template/blob/master/docs/secureapps.md).
 * Check the `src/renderer/window.d.ts` file for explanation for the exposed object.
 */

const { version } = require("../../release/app/package.json")
const { clipboard, contextBridge, ipcRenderer, shell } = require("electron")

contextBridge.exposeInMainWorld("electron", {
	isDev:
		process.env.NODE_ENV !== "production" ||
		process.env.DEBUG_PROD === "true",
	appVersion: version,
	openDirectory: (path) => {
		shell.openPath(path)
	},
	readClipboardText: () => clipboard.readText(),
	ipcRenderer: {
		send(...args) {
			ipcRenderer.send("r2m", ...args)
		},

		on(func) {
			ipcRenderer.on("m2r", (_, ...args) => func(...args))
		},
	},
})
