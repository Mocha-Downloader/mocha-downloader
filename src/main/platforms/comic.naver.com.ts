import sharp, { OverlayOptions } from "sharp"
import { IpcMainEvent } from "electron"
import { randomUUID } from "crypto"
import sizeOf from "image-size"
import cheerio from "cheerio"
import axios from "axios"

import { getHTMLFromWindow, getImageBuffer, parseSite } from "../util"
import { mainWindow } from "../main"

import { DownloadFlags, Platform } from "../constants"

async function downloadEpisode(url: string, flags?: DownloadFlags) {
	const [userAgent, $] = await parseSite<[string, cheerio.Root]>(
		url,
		async (window) => {
			return [
				window.webContents.session.getUserAgent(),
				cheerio.load(await getHTMLFromWindow(window)),
			]
		}
	)

	const title = $("meta[property='og:description']").attr("content")

	const imgLinks: string[] = []
	$("#comic_view_area > div.wt_viewer > img").each((i, elem) => {
		//@ts-ignore
		imgLinks[i] = String(elem.attribs.src)
	})

	const downloadCardData: { [key: string]: any } = {}
	downloadCardData[randomUUID()] = {
		title: title,
		platform: "comic.naver.com",
		thumbnail: $(
			"#sectionContWide > div.comicinfo > div.thumb > a > img"
		).attr("src"),
		totalAmount: imgLinks.length,
		unit: "images",
	}
	mainWindow?.webContents.send("m2r", "download", downloadCardData)

	if (flags?.dryRun) return

	const imgs: Buffer[] = []
	await Promise.all(
		imgLinks.map(async (imgLink, i) => {
			imgs[i] = await getImageBuffer(imgLink, userAgent)
		})
	)

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

	console.log(`Download complete! ${url}`)
}

async function downloadEpisodes(
	url: string,
	selected: number[],
	flags?: DownloadFlags
) {
	console.log(url, selected, flags)
}

async function getList(url: string): Promise<{ title: string; url: string }[]> {
	const parsedURL = new URL(url)
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

async function logic(
	event: IpcMainEvent,
	url: string,
	parsedURL: URL,
	selected?: number[]
) {
	if (parsedURL.pathname == "/webtoon/detail") {
		downloadEpisode(url)
		return
	}

	if (parsedURL.pathname == "/webtoon/list") {
		if (!selected || selected.length <= 0) {
			const selectable = await getList(url)
			event.reply("m2r", "select", url, selectable)
			return
		}

		downloadEpisodes(url, selected)
		return
	}
}

export default {
	meta: {
		id: "comic.naver.com",
	},
	logic,
	downloadEpisode,
	downloadEpisodes,
	getList,
} as Platform
