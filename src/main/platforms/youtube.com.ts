import ytdl from "ytdl-core"
import fs from "fs"

import { Platform, PlatformMeta } from "common/constants"

import { createDownloadCard, m2r } from "../util"
import { DownloadPayload } from "common/ipcTypes"

const meta: PlatformMeta = {
	id: "youtube.com",
	code: "yt",
}

// todo: download as mp3

// enum ChannelVideoSortEnum {
// 	RECENT = "RECENT",
// 	OLDEST = "OLDEST",
// 	POPULAR = "POPULAR",
// }

enum PlaylistVideoSortEnum {
	RECENT_ADDED = "RECENT_ADDED",
	OLDEST_ADDED = "OLDEST_ADDED",
	POPULAR = "POPULAR",
	RECENT_PUBLISHED = "RECENT_PUBLISHED",
	OLDEST_PUBLISHED = "OLDEST_PUBLISHED",
}

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
		const thumbnail = videoInfo.videoDetails.thumbnail.thumbnails[0].url
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

async function downloadPlaylist(
	url: string,
	selected: number[]
): Promise<void> {
	console.log(url, selected)
}

async function getPlaylistVideos(url: string, sort: PlaylistVideoSortEnum) {
	console.log(url, sort)
	return []
}

async function logic(downloadPayload: DownloadPayload) {
	const parsedURL = new URL(downloadPayload.url)

	// todo: link type categorization
	switch (parsedURL.pathname) {
		case "/watch":
			downloadVideo(downloadPayload.url)
			return
		case "playlist":
			if (
				!downloadPayload.selected ||
				downloadPayload.selected.length <= 0
			) {
				const selectable = await getPlaylistVideos(
					downloadPayload.url,
					PlaylistVideoSortEnum.RECENT_ADDED
				)
				m2r({
					type: "select",
					payload: {
						url: downloadPayload.url,
						availableChoices: selectable,
					},
				})
				return
			}

			downloadPlaylist(downloadPayload.url, downloadPayload.selected)
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

export default { meta, logic, test } as Platform
