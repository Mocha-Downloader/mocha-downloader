import webtorrent from "webtorrent"
import axios from "axios"
import arrayBufferToBuffer from "arraybuffer-to-buffer"

import { B2MB, createDownloadCard } from "../util"

import { Platform, PlatformMeta } from "../../common/constants"
import { DownloadPayload } from "../../common/ipcTypes"
import { downloadPool } from "../downloading"
import { mochaPath } from "../constants"

const meta: PlatformMeta = {
	id: "bittorrent",
	code: "tr",
}

const client = new webtorrent()

/**
 * Download from a torrent file or a [magnet link](https://en.wikipedia.org/wiki/Magnet_URI_scheme).
 *
 * @param {string | Buffer} torrentID - either a magnet link or a .torrent file content
 * @returns {Promise<void>}
 */
export async function downloadTorrent(
	torrentID: string | Buffer
): Promise<void> {
	const [updateDownloadCard, downloadCardID] = createDownloadCard({
		platform: meta.id,
		unit: "MB",
	})

	// todo: use file path and not the path of torrent folder
	const downloadPath = `${mochaPath}/${meta.id}`
	updateDownloadCard("downloadPath", downloadPath)

	client.add(torrentID, { path: downloadPath }, (torrent) => {
		updateDownloadCard("status", "downloading")

		downloadPool[downloadCardID] = {
			pause() {
				torrent.pause()
			},
			resume() {
				torrent.resume()
			},
			stop() {
				torrent.destroy()
			},
		}

		updateDownloadCard("title", torrent.name)
		updateDownloadCard("totalAmount", B2MB(torrent.length))

		// torrent.files.every((file) => {
		// 	if (
		// 		file.name.endsWith(".png") ||
		// 		file.name.endsWith(".jpg") ||
		// 		file.name.endsWith(".jpeg")
		// 	) {
		// 		// todo: update thumbnail

		// 		return false // break the loop
		// 	}

		// 	return true // continue to the next file
		// })

		let lastUpdated = new Date().getTime()
		torrent.on("download", () => {
			// stop if there was an update 200ms ago
			if (new Date().getTime() - lastUpdated <= 200) return

			updateDownloadCard("amountComplete", B2MB(torrent.downloaded))
		})

		torrent.on("done", () => {
			updateDownloadCard("isDownloadComplete", true)
			delete downloadPool[downloadCardID]
		})
	})
}

async function logic(data: DownloadPayload) {
	downloadTorrent(data.data)
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
			axios({
				method: "GET",
				url: "https://webtorrent.io/torrents/big-buck-bunny.torrent",
				responseType: "arraybuffer",
			}).then((res) => {
				logic({
					data: arrayBufferToBuffer(res.data),
				})
			})

			break
	}
}

export default { meta, logic, test } as Platform
