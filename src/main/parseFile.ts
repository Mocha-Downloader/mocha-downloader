/**
 * @file parse drag 'n' dropped file(s)
 */
import arrayBufferToBuffer from "arraybuffer-to-buffer"

import downloadLogic from "./downloadLogic"
import { downloadTorrent } from "./platforms/torrent"

import { DownloadPayload, FileDropPayload } from "../common/ipcTypes"
import { m2r } from "./util"

export type BatchFile = {
	version: "1.0"
	download: DownloadPayload[]
}

export default function parseFile(file: FileDropPayload) {
	// check if it's a Mocha Downloader batch download file
	if (file.name.endsWith(".json") || file.name.endsWith(".jsonc")) {
		try {
			const parsedData = JSON.parse(file.content.toString()) as BatchFile

			parsedData.download.forEach((data) => {
				downloadLogic(data)
			})

			return
		} catch (err) {
			// file's not a batch download file. Continue.
		}
	}

	if (file.name.endsWith(".torrent")) {
		downloadTorrent(arrayBufferToBuffer(file.content))

		return
	}

	m2r({
		type: "unsupported platform",
		payload: file.name,
	})
}
