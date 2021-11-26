import sharp, { OverlayOptions } from "sharp"
import { randomUUID } from "crypto"
import sizeOf from "image-size"
import cheerio from "cheerio"
import axios from "axios"

import { getHTMLFromWindow, getImageBuffer, parseSite, m2r } from "../util"

import { DownloadFlags, Platform } from "../constants"

// todo: add referrer and headers to requests

async function downloadEpisode(url: string, flags?: DownloadFlags) {
	const downloadID = randomUUID()

	const downloadCardData: { [key: string]: any } = {}
	downloadCardData[downloadID] = {
		platform: "comic.naver.com",
		title: "title",
		thumbnail: "https://react.semantic-ui.com/images/wireframe/image.png", // placeholder image

		status: "loading page",
		totalAmount: 0,
		amountComplete: 0,

		isDownloadComplete: false,
	}
	m2r("download", "new", downloadCardData)

	const [userAgent, $] = await parseSite<[string, cheerio.Root]>(
		url,
		async (window) => {
			return [
				window.webContents.session.getUserAgent(),
				cheerio.load(await getHTMLFromWindow(window)),
			]
		}
	)
	m2r(
		"download",
		"update",
		downloadID,
		"thumbnail",
		$("#sectionContWide > div.comicinfo > div.thumb > a > img").attr("src")
	)

	const title = $("meta[property='og:description']").attr("content")
	m2r("download", "update", downloadID, "title", title)

	const imgLinks: string[] = []
	$("#comic_view_area > div.wt_viewer > img").each((i, elem) => {
		//@ts-ignore
		imgLinks[i] = String(elem.attribs.src)
	})
	m2r("download", "update", downloadID, "totalAmount", imgLinks.length + 2) // +1 for image stitching and 1 for saving

	if (flags?.dryRun) return

	const imgs: Buffer[] = []
	let amountComplete = 0 // number of images done downloading
	await Promise.all(
		imgLinks.map(async (imgLink, i) => {
			imgs[i] = await getImageBuffer(imgLink, userAgent)
			amountComplete += 1
			m2r(
				"download",
				"update",
				downloadID,
				"amountComplete",
				amountComplete
			)
		})
	)

	m2r("download", "update", downloadID, "status", "parsing images")

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
	amountComplete += 1

	m2r("download", "update", downloadID, "amountComplete", amountComplete)
	m2r("downlaod", "update", downloadID, "status", "stitching images")

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
	amountComplete += 1

	m2r("download", "update", downloadID, "amountComplete", amountComplete)
	m2r("download", "update", downloadID, "isDownloadComplete", "true")
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

async function logic(url: string, parsedURL: URL, selected?: number[]) {
	if (parsedURL.pathname == "/webtoon/detail") {
		downloadEpisode(url)
		return
	}

	if (parsedURL.pathname == "/webtoon/list") {
		if (!selected || selected.length <= 0) {
			const selectable = await getList(url)
			m2r("select", url, selectable)
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
