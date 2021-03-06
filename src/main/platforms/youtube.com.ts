import ytdl from "ytdl-core"
import ytpl from "ytpl"
import fs from "fs"

import { B2MB, createDownloadCard, m2r, recursiveMkdir } from "../util"

import { Platform, PlatformMeta } from "../../common/constants"
import { DownloadPayload } from "../../common/ipcTypes"
import { downloadPool } from "../downloading"
import { mochaPath } from "../constants"

const meta: PlatformMeta = {
	id: "youtube.com",
	code: "yt",
}

// enum ChannelVideoSortEnum {
// 	RECENT,
// 	OLDEST,
// 	POPULAR,
// }

// enum PlaylistVideoSortEnum {
// 	RECENT_ADDED,
// 	OLDEST_ADDED,
// 	POPULAR,
// 	RECENT_PUBLISHED,
// 	OLDEST_PUBLISHED,
// }

/**
 * Download a video from youtube.
 *
 * @param {string} url - URL of the video
 * @param {DownloadFlags} [flags]
 * @returns {Promise<void>}
 */
async function downloadVideo(url: string): Promise<void> {
	const [updateDownloadCard, downloadCardID] = createDownloadCard({
		platform: meta.id,
		unit: "MB",
	})

	const video = ytdl(url)
	updateDownloadCard("status", "downloading video")

	downloadPool[downloadCardID] = {
		pause() {
			video.pause()
		},
		resume() {
			video.resume()
		},
		stop() {
			console.log(video, typeof video)
			video.destroy()
		},
	}

	const videoInfo = await ytdl.getBasicInfo(url)

	const folderPath = `${mochaPath}/${meta.id}/${videoInfo.videoDetails.ownerChannelName}`
	updateDownloadCard("downloadPath", folderPath)
	const filePath = `${folderPath}/${videoInfo.videoDetails.title}.mp4`

	updateDownloadCard("title", videoInfo.videoDetails.title)
	updateDownloadCard("thumbnail", videoInfo.videoDetails.thumbnails[0].url)

	// update progress
	let _isTotalAmountDataSent = false
	video.on("progress", (_, downloadedBytes: number, totalBytes: number) => {
		// send total amount data only once
		if (!_isTotalAmountDataSent) {
			updateDownloadCard("totalAmount", B2MB(totalBytes))
			_isTotalAmountDataSent = true
		}

		updateDownloadCard("amountComplete", B2MB(downloadedBytes))
	})

	video.on("end", () => {
		updateDownloadCard("isDownloadComplete", true)
	})

	// save to file
	await recursiveMkdir(folderPath)
	video.pipe(fs.createWriteStream(filePath))

	delete downloadPool[downloadCardID]
}

/**
 * Download videos from playlist.
 *
 * @param {string} url - URL of the playlist
 * @param {number[]} selected - index of playlist videos to download starting from 0.
 * @returns {Promise<void>}
 */
async function downloadVideos(url: string, selected: number[]): Promise<void> {
	// todo: don't fetch video list again when it's already fetched
	const playlist = await ytpl(url, { limit: Infinity })

	selected.map((playlistIndex) => {
		downloadVideo(playlist.items[playlistIndex].shortUrl)
	})
}

/**
 * Gets a list of all videos in a playlist or a channel.
 *
 * @param {string} url - URL of the playlist or the channel.
 * @returns {Promise<ytpl.Item[]>}
 */
async function getVideoList(url: string): Promise<ytpl.Item[]> {
	const parsedURL = new URL(url)

	// todo: get sort info from url instead of ignoring it
	// url parsing doesn't work with trailing /videos for some reason
	if (parsedURL.pathname.endsWith("/videos")) {
		parsedURL.pathname = parsedURL.pathname.replace("/videos", "")
	}

	return (await ytpl(parsedURL.href, { limit: Infinity })).items
}

async function logic(data: DownloadPayload) {
	const parsedURL = new URL(data.data)

	if (parsedURL.pathname.startsWith("/watch")) {
		if (parsedURL.searchParams.has("list")) {
			videoListLogic(data)
			return
		}

		downloadVideo(data.data)
		return
	}

	if (parsedURL.pathname.startsWith("/shorts")) {
		downloadVideo(data.data)
		return
	}

	if (parsedURL.pathname.startsWith("/playlist")) {
		videoListLogic(data)
		return
	}

	if (
		parsedURL.pathname.startsWith("/c/") ||
		parsedURL.pathname.startsWith("/channel")
	) {
		videoListLogic(data)
		return
	}

	// todo: replace with user feedback
	throw Error(
		"Unrecognized content. If you think this is a bug, make a bug report! (https://github.com/Mocha-Downloader/mocha-downloader/issues)"
	)
}

/**
 * Logic for downloading a list of videos (i.e. playlist and channel)
 *
 * @param {DownloadPayload} data
 */
async function videoListLogic(data: DownloadPayload) {
	if (!data.options?.selected || data.options.selected.length <= 0) {
		getVideoList(data.data).then((playlistData) => {
			m2r({
				type: "select",
				payload: {
					url: data.data,
					availableChoices: playlistData,
				},
			})
		})
	} else {
		downloadVideos(data.data, data.options.selected)
	}
}

// v: video
// s: shorts
// p: playlist
// c: channel
type OperationType = "v" | "s" | "p" | "c"

async function test(operationType: OperationType) {
	switch (operationType) {
		case "v":
			logic({
				data: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
			})
			break

		case "s":
			logic({
				data: "https://www.youtube.com/shorts/qzqxZB2961Q",
			})
			break

		case "p":
			logic({
				data: "https://www.youtube.com/playlist?list=PLzkuLC6Yvumv_Rd5apfPRWEcjf9b1JRnq",
			})
			break

		// le me
		case "c":
			logic({
				data: "https://www.youtube.com/channel/UCq42p4jHBZnzZE9LG7hoBJw/videos",
			})
			break
	}
}

export default { meta, logic, test } as Platform
