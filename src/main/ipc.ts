/**
 * @file Manages communication between the main process and the renderer process
 */

import { ipcMain } from "electron"

import { R2MArgs } from "../common/ipcTypes"

import parseFile from "./parseFile"
import { isDev } from "./constants"
import downloadLogic from "./downloadLogic"
import { downloadPool } from "./downloading"
import { loadSettings, saveSettings, changeLangTo } from "./settings"
import { m2r } from "./util"

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
						// set card download status to complete
						m2r({
							type: "download",
							payload: {
								action: "update",
								payload: {
									downloadCardID:
										r2mArgs.payload.downloadCardID,
									key: "isDownloadComplete",
									value: true,
								},
							},
						})

						// remove download controller from download pool
						delete downloadPool[r2mArgs.payload.downloadCardID]

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
