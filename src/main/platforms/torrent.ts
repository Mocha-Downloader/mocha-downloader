import webtorrent from "webtorrent"
import axios from "axios"

import { createDownloadCard } from "../util"

import { mochaPath, Platform, PlatformMeta } from "../../common/constants"
import { DownloadPayload } from "../../common/ipcTypes"

const meta: PlatformMeta = {
	id: "bittorrent",
	code: "tr",
}

const client = new webtorrent()

/**
 * Download from a torrent file or a [magnet link](https://en.wikipedia.org/wiki/Magnet_URI_scheme).
 *
 * @param {string} torrentID - either a magnet link or a .torrent file content
 * @returns {Promise<void>}
 */
async function DownloadTorrent(torrentID: string): Promise<void> {
	const [updateDownloadCard] = createDownloadCard({
		platform: meta.id,
		unit: "MB",
	})

	// downloadPool[downloadCardID] = {
	// 	pause() {
	// 	},
	// 	resume() {
	// 	},
	// 	stop() {
	// 	},
	// }

	const parsedTorrentID = torrentID.startsWith("magnet:")
		? torrentID // leave it as it is if torrentID starts with "magnet:"
		: Buffer.from(torrentID, "utf-8") // convert it to buffer otherwise

	client.add(
		parsedTorrentID,
		{ path: `${mochaPath}/${meta.id}` },
		(torrent) => {
			torrent.files.map((file) => {
				console.log(file.name)
			})

			torrent.on("done", () => {
				updateDownloadCard("isDownloadComplete", true)
			})
		}
	)
}

async function logic(data: DownloadPayload) {
	DownloadTorrent(data.data)
}

// m: magnet link
// f: file
type ActionType = "m" | "f"

async function test(actionType: ActionType) {
	switch (actionType) {
		case "m":
			logic({
				data: "magnet:?xt=urn:btih:dd8255ecdc7ca55fb0bbf81323d87062db1f6d1c&dn=Big+Buck+Bunny&tr=udp%3A%2F%2Fexplodie.org%3A6969&tr=udp%3A%2F%2Ftracker.coppersurfer.tk%3A6969&tr=udp%3A%2F%2Ftracker.empire-js.us%3A1337&tr=udp%3A%2F%2Ftracker.leechers-paradise.org%3A6969&tr=udp%3A%2F%2Ftracker.opentrackr.org%3A1337&tr=wss%3A%2F%2Ftracker.btorrent.xyz&tr=wss%3A%2F%2Ftracker.fastcast.nz&tr=wss%3A%2F%2Ftracker.openwebtorrent.com&ws=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2F&xs=https%3A%2F%2Fwebtorrent.io%2Ftorrents%2Fbig-buck-bunny.torrent",
			})
			break

		case "f":
			axios
				.get(
					encodeURI(
						"https://webtorrent.io/torrents/big-buck-bunny.torrent"
					),
					{ responseType: "text" }
				)
				.then((res) => {
					console.log(res, typeof res)

					logic({
						data: String(res),
					})
				})

			break
	}
}

export default { meta, logic, test } as Platform
