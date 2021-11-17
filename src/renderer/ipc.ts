window.electron.ipcRenderer.on((...args) => {
	if (window.electron.isDev) console.log("m2r:", args)

	if (args[0] === "select")
		console.log(`showing menu for ${args[1]}:`, args[2])
})
