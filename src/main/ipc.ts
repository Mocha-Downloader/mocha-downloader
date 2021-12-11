/**
 * @file Manages communication between the main process and the renderer process
 */

import { ipcMain } from "electron"
import { changeLanguage } from "i18next"

import { R2MArgs } from "common/ipcTypes"

import { isDev, buildTray } from "./main"
import { downloadPool } from "./downloading"

import parseFile from "./parseFile"
import downloadLogic from "./downloadLogic"

ipcMain.on("r2m", async (_, r2mArgs: R2MArgs) => {
	if (isDev) console.log("r2m:", r2mArgs)

	switch (r2mArgs.type) {
		case "download": {
			downloadLogic(r2mArgs.payload)
			break
		}

		case "fileDrop":
			parseFile(r2mArgs.payload)
			break

		case "downloadControl":
			const downloadController =
				downloadPool[r2mArgs.payload.downloadCardID]

			if (downloadController) {
				switch (r2mArgs.payload.type) {
					case "pause":
						downloadController.pause()
						break

					case "resume":
						downloadController.resume()
						break

					case "stop":
						downloadController.stop()
						break
				}
			}

			break

		case "changeLang":
			changeLanguage(r2mArgs.payload)
			buildTray()
			break
	}
})
