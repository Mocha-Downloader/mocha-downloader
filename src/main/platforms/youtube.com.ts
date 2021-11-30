import ytdl from "ytdl-core"
import ytpl from "ytpl"
import fs from "fs"

import { Platform, PlatformMeta } from "common/constants"

import { createDownloadCard, m2r } from "../util"
import { DownloadPayload } from "common/ipcTypes"

const meta: PlatformMeta = {
	id: "youtube.com",
	code: "yt",
}

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
		unit: "MB",
	})
	const video = ytdl(url)
	const filePath = "video.mp4"

	ytdl.getBasicInfo(url).then((videoInfo) => {
		updateDownloadCard("title", videoInfo.videoDetails.title)
		const thumbnail = videoInfo.videoDetails.thumbnails[0].url
		updateDownloadCard("thumbnail", thumbnail)
	})

	// update progress
	let _isTotalAmountDataSent = false
	video.on("progress", (_, downloadedBytes: number, totalBytes: number) => {
		// send total amount data only once
		if (!_isTotalAmountDataSent) {
			updateDownloadCard("totalAmount", B2MB(totalBytes).toFixed(2))
			_isTotalAmountDataSent = true
		}

		updateDownloadCard("amountComplete", B2MB(downloadedBytes).toFixed(2))
	})

	video.on("end", () => {
		updateDownloadCard("isDownloadComplete", true)
	})

	// save to file
	video.pipe(fs.createWriteStream(filePath))
}

/**
 * Download videos from playlist.
 *
 * @param {string} url - URL of the playlist
 * @param {number[]} selected - index of playlist videos to download starting from 0.
 *
 * @returns {Promise<void>}
 */
async function downloadPlaylist(
	url: string,
	selected: number[]
): Promise<void> {
	const playlist = await ytpl(url, { limit: Infinity })

	selected.map((playlistIndex) => {
		downloadVideo(playlist.items[playlistIndex].shortUrl)
	})
}

/**
 * Gets a list of all items in a playlist
 *
 * @param {string} url - URL of the playlist
 *
 * @returns {Promise<ytpl.Item[]>}
 */
async function getPlaylistVideos(url: string): Promise<ytpl.Item[]> {
	const playlist = await ytpl(url, { limit: Infinity })

	return playlist.items
}

async function logic(downloadPayload: DownloadPayload) {
	const playlistLogic = async () => {
		if (!downloadPayload.selected || downloadPayload.selected.length <= 0) {
			getPlaylistVideos(downloadPayload.url).then((playlistData) => {
				m2r({
					type: "select",
					payload: {
						url: downloadPayload.url,
						availableChoices: playlistData,
					},
				})
			})
		} else {
			downloadPlaylist(downloadPayload.url, downloadPayload.selected)
		}
	}

	const parsedURL = new URL(downloadPayload.url)

	switch (parsedURL.pathname) {
		case "/watch":
			if (parsedURL.searchParams.has("list")) {
				playlistLogic()
				return
			}

			downloadVideo(downloadPayload.url)
			return
		case "/playlist":
			playlistLogic()
			return
	}
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

		case "p":
			downloadPlaylist(
				"https://www.youtube.com/playlist?list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq",
				[0, 1]
			)
			break

		// case "c":
		// 	downloadChannel(
		// 		"https://www.youtube.com/c/Techquickie/videos",
		// 		[0],
		// 		ChannelVideoSortEnum.RECENT
		// 	)
		// 	break
	}
}

export default { meta, logic, test } as Platform
