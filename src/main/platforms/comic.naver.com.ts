import sharp, { OverlayOptions } from "sharp"
import sizeOf from "image-size"
import cheerio from "cheerio"
import axios from "axios"

import {
	Platform,
	ISelectOption,
	PlatformMeta,
	userAgent,
} from "../../common/constants"
import { DownloadPayload } from "../../common/ipcTypes"
import {
	getHTMLFromWindow,
	getImageBuffer,
	m2r,
	parseSite,
	createDownloadCard,
} from "../util"

const meta: PlatformMeta = {
	id: "comic.naver.com",
	code: "nv",
}

/**
 * Downloads a episode of naver comic.
 *
 * @param {string} url - URL of the episode
 * @param {DownloadFlags} [flags]
 * @returns {Promise<void>}
 */
async function downloadEpisode(url: string): Promise<void> {
	let isPaused = false // set to true to pause download and change to false to resume
	let isStopped = false // set to true to stop download

	const [updateDownloadCard] = createDownloadCard(
		{
			platform: meta.id,
			unit: "images",
		},
		{
			pause() {
				isPaused = true
			},
			resume() {
				isPaused = false
			},
			stop() {
				isStopped = true
				isPaused = false // set it to false to prevent infinite loops
			},
		}
	)

	/**
	 * Load HTML content
	 */

	const $ = await parseSite(url, async (window) =>
		cheerio.load(await getHTMLFromWindow(window))
	)

	// set download card thumbnail
	updateDownloadCard(
		"thumbnail",
		$("#sectionContWide > div.comicinfo > div.thumb > a > img").attr("src")
	)

	// get title
	const title = $("meta[property='og:description']").attr("content")

	// set download card title
	updateDownloadCard("title", title)

	/**
	 * Fetch image links
	 */

	const imgLinks: string[] = []
	$("#comic_view_area > div.wt_viewer > img").each((i, elem) => {
		//@ts-ignore
		imgLinks[i] = String(elem.attribs.src)
	})

	// stop if no image was found
	if (imgLinks.length <= 0) {
		updateDownloadCard("status", "ERROR: couldn't fetch images")
		return
	}

	// set total download steps
	updateDownloadCard("totalAmount", imgLinks.length)

	if (isStopped) return

	/**
	 * Download images
	 */

	const imgs: Buffer[] = []
	let amountComplete = 0 // number of images done downloading
	await Promise.all(
		imgLinks.map(async (imgLink, i) => {
			if (isStopped) return

			// wait 500ms while isPaused is set to true
			while (isPaused) await new Promise((r) => setTimeout(r, 500))

			imgs[i] = await getImageBuffer(imgLink, userAgent)
			amountComplete += 1
			updateDownloadCard("amountComplete", amountComplete)
		})
	)

	if (isStopped) return

	/**
	 * Prepare for image stitching
	 */

	updateDownloadCard("status", "parsing images")

	const imgsToStitch: OverlayOptions[] = []
	let heightCount = 0
	let maxWidth = 0

	for (let i = 0; i < imgs.length; i++) {
		const image = imgs[i]
		const dimensions = sizeOf(image)
		if (!dimensions.height || !dimensions.width) continue

		if (dimensions.width > maxWidth) maxWidth = dimensions.width

		imgsToStitch.push({
			input: image,
			left: 0,
			top: heightCount,
		})
		heightCount += dimensions.height
	}

	if (isStopped) return

	/**
	 * Stitch and save image
	 */

	updateDownloadCard("status", "stitching images")

	await sharp({
		create: {
			width: maxWidth,
			height: heightCount,
			channels: 3,
			background: "#ffffff",
		},
	})
		.composite(imgsToStitch)
		.png({ quality: 100 })
		.toFile(`${title}.png`)

	/**
	 * Done!
	 */

	updateDownloadCard("isDownloadComplete", "true")
}

/**
 * Download multiple episodes
 *
 * @param {string} url - URL of episode list
 * @param {number[]} selected - indices of episodes to download starting from 0
 * @param {DownloadFlags} [flags]
 * @returns {Promise<void>}
 */
async function downloadEpisodes(
	url: string,
	selected: number[]
): Promise<void> {
	const parsedURL = new URL(url)

	const comicType = parsedURL.pathname.split("/").filter(String)[0]
	const titleID = parsedURL.searchParams.get("titleId")
	const baseURL = `${parsedURL.origin}/${comicType}/detail`

	selected.map((episodeNum) => {
		downloadEpisode(`${baseURL}?titleId=${titleID}&no=${episodeNum}`)
	})
}

/**
 * Get a list of all episodes of a comic.
 *
 * @param {URL} parsedURL
 * @returns {Promise<ISelectOption[]>}
 */
async function getList(parsedURL: URL): Promise<ISelectOption[]> {
	const titleID = parsedURL.searchParams.get("titleId")

	// use url without page and other nonsense
	const $ = cheerio.load(
		(
			await axios.get(
				parsedURL.origin + parsedURL.pathname + "?titleId=" + titleID
			)
		).data
	)

	let latestEpisodeNumber = 0
	$("#content > table > tbody > tr > td.title > a").each((_, e) => {
		const numberToTest = Number(
			new URL(parsedURL.origin + $(e).attr("href")).searchParams.get("no")
		)
		latestEpisodeNumber =
			latestEpisodeNumber >= numberToTest
				? latestEpisodeNumber
				: numberToTest
	})

	const result = []

	for (let i = latestEpisodeNumber; i >= 1; i--) {
		result.push({
			title: `episode ${i}`,
			url: `https://comic.naver.com/webtoon/detail?titleId=${titleID}&no=${i}`,
		})
	}

	return result
}

async function logic(payload: DownloadPayload): Promise<void> {
	const parsedURL = new URL(payload.data)

	if (parsedURL.pathname.includes("/detail")) {
		downloadEpisode(parsedURL.href)
		return
	}

	if (parsedURL.pathname.includes("/list")) {
		if (
			!payload.options?.selected ||
			payload.options.selected.length <= 0
		) {
			const selectable = await getList(parsedURL)
			m2r({
				type: "select",
				payload: {
					url: parsedURL.href,
					availableChoices: selectable,
				},
			})
			return
		}

		downloadEpisodes(parsedURL.href, payload.options.selected)
		return
	}
}

// w: webtoon (웹툰)
// b: best challenge (베스트 도전)
// c: challenge (도전)
type ComicType = "w" | "b" | "c"

// e: episode
// l: list (first 3 only by default)
type DownloadType = "e" | "l"

async function test(
	comicType: ComicType,
	downloadType: DownloadType
): Promise<void> {
	switch (comicType) {
		// 신도림
		case "w":
			switch (downloadType) {
				case "e":
					logic({
						data: "https://comic.naver.com/webtoon/detail?titleId=683496&no=1",
					})
					break
				case "l":
					logic({
						data: "https://comic.naver.com/webtoon/list?titleId=683496",
					})
			}
			break

		// 괜찮아, 고3이야
		case "b":
			switch (downloadType) {
				case "e":
					logic({
						data: "https://comic.naver.com/bestChallenge/detail?titleId=643799&no=92",
					})
					break
				case "l":
					logic({
						data: "https://comic.naver.com/bestChallenge/list?titleId=643799",
					})
					break
			}
			break

		// test comic episode 1
		case "c":
			switch (downloadType) {
				case "e":
					logic({
						data: "https://comic.naver.com/challenge/detail?titleId=785847&no=1",
					})
					break
				case "l":
					logic({
						data: "https://comic.naver.com/challenge/list?titleId=785847",
					})
					break
			}
			break
	}
}

export default { meta, logic, test } as Platform
