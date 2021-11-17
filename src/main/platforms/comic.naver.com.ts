import { getHTMLFromWindow, getImageBuffer, parseSite } from "../util"
import cheerio from "cheerio"
import sharp, { OverlayOptions } from "sharp"
import sizeOf from "image-size"

async function downloadEpisode(url: string) {
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

async function downloadEpisodes(url: string, selected: number[]) {
	console.log(url, selected)
}

async function getList(url: string): Promise<{ title: string; url: string }[]> {
	return [
		{ title: "Original", url: url },
		{ title: "Google", url: "https://google.com" },
		{ title: "YouTube", url: "https://youtube.com" },
	]
}

export default {
	downloadEpisode,
	downloadEpisodes,
	getList,
}
