/**
 * @file parse drag 'n' dropped file(s)
 */

import downloadLogic from "./downloadLogic"
import platforms from "./platforms"

import { DownloadPayload } from "common/ipcTypes"

export type BatchFile = {
	version: "1.0"
	download: DownloadPayload[]
}

export default function parseFile(data: string) {
	// check if it's a Mocha Downloader batch file
	try {
		const parsedData = JSON.parse(data) as BatchFile

		parsedData.download.forEach((data) => {
			downloadLogic(data)
		})

		return
	} catch (err) {}

	platforms.torrent.logic({ data })
}
