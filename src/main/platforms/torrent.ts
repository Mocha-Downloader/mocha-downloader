import webtorrent from "webtorrent"

import { Platform, PlatformMeta } from "common/constants"
import { DownloadData } from "common/ipcTypes"

const meta: PlatformMeta = {
	id: "bittorrent",
	code: "tr",
}

const client = new webtorrent()

/**
 * Download files via magnet link
 *
 * @param {string} torrentID - [magnet link](https://en.wikipedia.org/wiki/Magnet_URI_scheme)
 * @returns {Promise<void>}
 */
async function DownloadMagnetLink(torrentID: string): Promise<void> {
	client.add(torrentID, (torrent) => {
		torrent.files.map((file) => {
			file.appendTo("body")
		})
	})
}

/**
 * Download torrent via .torrent file
 *
 * @returns {Promise<void>}
 */
async function DownloadFile(): Promise<void> {}

async function logic(data: DownloadData) {
	if (data.data.startsWith("magnet:")) {
		DownloadMagnetLink(data.data)
	} else {
		DownloadFile()
	}
}

// m: magnet link
// f: file
type ActionType = "m" | "f"

async function test(actionType: ActionType) {
	switch (actionType) {
		case "m":
			logic({
				data: "magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent",
			})
			break

		case "f":
			logic({
				data: "",
			})
			break
	}
}

export default { meta, logic, test } as Platform
