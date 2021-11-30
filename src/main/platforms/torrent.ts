import webtorrent from "webtorrent"

import { Platform, PlatformMeta } from "common/constants"

const meta: PlatformMeta = {
	id: "bittorrent",
	code: "tr",
}

/**
 * Download files via magnet link
 *
 * @param {string} torrentID - {@link https://en.wikipedia.org/wiki/Magnet_URI_scheme magnet link}
 * @returns {Promise<void>}
 */
async function DownloadMagnetLink(torrentID: string): Promise<void> {
	const client = new webtorrent()

	client.add(torrentID, (torrent) => {
		torrent.files.map((file) => {
			console.log(file.name)
		})
	})
}

/**
 * Download torrent via .torrent file
 *
 * @returns {Promise<void>}
 */
async function DownloadFile(): Promise<void> {}

async function logic(data: any) {
	console.log(data)
}

// m: magnet link
// f: file
type ActionType = "m" | "f"

async function test(actionType: ActionType) {
	switch (actionType) {
		case "m":
			DownloadMagnetLink(
				"magnet:?xt=urn:btih:08ada5a7a6183aae1e09d831df6748d566095a10&dn=Sintel&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fsintel.torrent"
			)
			break

		case "f":
			DownloadFile()
			break
	}
}

export default { meta, logic, test } as Platform
