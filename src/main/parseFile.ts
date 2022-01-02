/**
 * @file parse drag 'n' dropped file(s)
 */

import downloadLogic from "./downloadLogic"
import platforms from "./platforms"

import { DownloadPayload, FileDropPayload } from "../common/ipcTypes"
import { m2r } from "./util"

export type BatchFile = {
	version: "1.0"
	download: DownloadPayload[]
}

export default function parseFile(payload: FileDropPayload) {
	// check if it's a Mocha Downloader batch download file
	try {
		const parsedData = JSON.parse(payload.content) as BatchFile

		parsedData.download.forEach((data) => {
			downloadLogic(data)
		})

		return
	} catch (err) {
		// file's not a batch download file. Continue.
	}

	if (payload.content.startsWith("magnet")) {
		platforms.torrent.logic({ data: payload.content })
		return
	}

	m2r({
		type: "unsupported platform",
		payload: payload.name,
	})
}
