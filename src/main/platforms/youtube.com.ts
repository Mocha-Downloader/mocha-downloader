import ytdl from "ytdl-core"
import fs from "fs"

import { Platform } from "common/constants"

import { createDownloadCard } from "../util"

// todo: download as mp3

// enum ChannelVideoSortEnum {
// 	RECENT = "RECENT",
// 	OLDEST = "OLDEST",
// 	POPULAR = "POPULAR",
// }

// enum PlaylistVideoSortEnum {
// 	RECENT_ADDED = "RECENT_ADDED",
// 	OLDEST_ADDED = "OLDEST_ADDED",
// 	POPULAR = "POPULAR",
// 	RECENT_PUBLISHED = "RECENT_PUBLISHED",
// 	OLDEST_PUBLISHED = "OLDEST_PUBLISHED",
// }

/**
 * Converts byte to megabyte.
 *
 * @param {number} num - number of bytes to be converted
 * @returns {number}
 */
function B2MB(num: number): number {
	return num / 1048576
}

/**
 * Download a video from youtube.
 *
 * @param {string} url - URL of the video
 * @param {DownloadFlags} [flags]
 * @returns {Promise<void>}
 */
async function downloadVideo(url: string): Promise<void> {
	const [updateDownloadCard] = createDownloadCard({
		platform: "youtube.com",
	})

	const video = ytdl(url)
	const output = "video.mp4"

	video.pipe(fs.createWriteStream(output))

	video.on("progress", (_, downloadedBytes: number, totalBytes: number) => {
		updateDownloadCard("totalAmount", B2MB(totalBytes).toFixed(2))
		updateDownloadCard("amountComplete", B2MB(downloadedBytes).toFixed(2))
	})

	video.on("end", () => {
		updateDownloadCard("isDownloadComplete", true)
	})
}

// async function getPlaylistVideos(parsedURL: URL, sort: PlaylistVideoSortEnum) {
// 	console.log(parsedURL.href, sort)
// 	return []
// }

async function logic(parsedURL: URL, selected?: number[]) {
	console.log(parsedURL.href, selected)

	// switch (parsedURL.pathname) {
	// 	case "/watch":
	// 		downloadVideo(parsedURL.href)
	// 		return
	// 	case "playlist":
	// 		if (!selected || selected.length <= 0) {
	// 			const selectable = await getPlaylistVideos(
	// 				parsedURL,
	// 				PlaylistVideoSortEnum.RECENT_ADDED
	// 			)
	// 			m2r("select", parsedURL.href, selectable)
	// 			return
	// 		}

	// 		// downloadPlaylist(parsedURL.href, selected)
	// 		return
	// }
}

// v: video
// p: playlist
// c: channel
type OperationType = "v" | "p" | "c"

async function test(operationType: OperationType) {
	switch (operationType) {
		case "v":
			downloadVideo("https://www.youtube.com/watch?v=dQw4w9WgXcQ")
			break

		// case "p":
		// 	downloadPlaylist(
		// 		"https://www.youtube.com/playlist?list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq",
		// 		[0, 1]
		// 	)
		// 	break

		// case "c":
		// 	downloadChannel(
		// 		"https://www.youtube.com/c/Techquickie/videos",
		// 		[0],
		// 		ChannelVideoSortEnum.RECENT
		// 	)
		// 	break
	}
}

export default {
	meta: {
		id: "youtube.com",
		code: "yt",
	},
	logic,
	test,
} as Platform
