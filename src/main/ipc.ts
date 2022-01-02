/**
 * @file Manages communication between the main process and the renderer process
 */

import { ipcMain } from "electron"
import { changeLanguage } from "i18next"

import { R2MArgs } from "../common/ipcTypes"

import { m2r } from "./util"
import parseFile from "./parseFile"
import { isDev, buildTray } from "./main"
import downloadLogic from "./downloadLogic"
import { downloadPool } from "./downloading"
import { settings, loadSettings, saveSettings } from "./settings"

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
					await loadSettings()

					m2r({
						type: "settings",
						payload: settings,
					})
					return

				case "save":
					saveSettings()
					return

				case "changeLanguage":
					settings.locale = r2mArgs.payload.payload
					changeLanguage(r2mArgs.payload.payload)
					buildTray()
					break
			}

			saveSettings()
			break
	}
})
