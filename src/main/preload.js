/**
 * @file Exposes api to the front end without compromising security. More information can be found [here](https://www.electronjs.org/docs/latest/tutorial/context-isolation) and [here](https://github.com/reZach/secure-electron-template/blob/master/docs/secureapps.md)
 */

const { version } = require("../../release/app/package.json")
const { contextBridge, ipcRenderer } = require("electron")
const { platform, arch, release } = require("os")

contextBridge.exposeInMainWorld("electron", {
	isDev:
		process.env.NODE_ENV !== "production" ||
		process.env.DEBUG_PROD === "true",
	data: {
		appVersion: version,
		os: {
			platform: platform(),
			arch: arch(),
			release: release(),
		},
	},
	ipcRenderer: {
		// sendSync freezes the client for some reason
		send(...args) {
			ipcRenderer.send("r2m", ...args)
		},

		// events are deliberately stripped as it includes `sender`

		on(func) {
			ipcRenderer.on("m2r", (_, ...args) => func(...args))
		},
	},
})
