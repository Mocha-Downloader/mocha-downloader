/**
 * @file Manages communication between the main process and the renderer process
 */

import { ipcMain } from "electron"

import { R2MArgs } from "../common/ipcTypes"

import parseFile from "./parseFile"
import { isDev } from "./main"
import downloadLogic from "./downloadLogic"
import { downloadPool } from "./downloading"
import { loadSettings, saveSettings, changeLangTo } from "./settings"

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

		case "settings":
			switch (r2mArgs.payload.type) {
				case "load":
					loadSettings()
					return

				case "save":
					saveSettings()
					return

				case "changeLanguage":
					changeLangTo(r2mArgs.payload.payload)
					break
			}

			saveSettings()
			break
	}
})
