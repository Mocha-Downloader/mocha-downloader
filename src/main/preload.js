const { contextBridge, ipcRenderer } = require("electron")

contextBridge.exposeInMainWorld("electron", {
	isDev:
		process.env.NODE_ENV === "development" ||
		process.env.DEBUG_PROD === "true",
	ipcRenderer: {
		send(...args) {
			ipcRenderer.send("r2m", ...args)
		},
		// This freezes the client for some reason
		// sendSync(...args) {
		// 	ipcRenderer.sendSync("r2m", ...args)
		// },

		// events are deliberately stripped as it includes `sender`

		on(func) {
			ipcRenderer.on("m2r", (_, ...args) => func(...args))
		},
		once(func) {
			ipcRenderer.once("m2r", (_, ...args) => func(...args))
		},
	},
})

console.log("preload.js loaded!")
