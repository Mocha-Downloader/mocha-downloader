import { app, BrowserWindow } from "electron"
import { Required, Optional, $Keys } from "utility-types"
import { randomUUID } from "crypto"
import { URL } from "url"
import axios from "axios"
import path from "path"

import { IDownloadCardProps, platformID } from "common/constants"

import { mainWindow } from "./main"
import { DownloadPayload, M2RArgs } from "common/ipcTypes"

export let resolveHtmlPath: (htmlFileName: string) => string

if (process.env.NODE_ENV === "development") {
	const port = process.env.PORT || 1212
	resolveHtmlPath = (htmlFileName: string) => {
		const url = new URL(`http://localhost:${port}`)
		url.pathname = htmlFileName
		return url.href
	}
} else {
	resolveHtmlPath = (htmlFileName: string) => {
		return `file://${path.resolve(__dirname, "../renderer/", htmlFileName)}`
	}
}

export function getAssetPath(...paths: string[]): string {
	return path.join(
		app.isPackaged
			? path.join(process.resourcesPath, "assets")
			: path.join(__dirname, "../../assets"),
		...paths
	)
}

/**
 * Loads a page in a headless browser window
 *
 * @param {string} url - url to load
 * @param {function(BrowserWindow): Promise<T>} func - code to run with the browser window
 * @returns {Promise<T>}
 */
export async function parseSite<T>(
	url: string,
	func: (window: BrowserWindow) => Promise<T>
): Promise<T> {
	const window = new BrowserWindow({ show: false })
	window.loadURL(url)

	const result = await func(window)

	window.close()

	return result
}

/**
 * Get html content from an electron window and returns it as a string
 *
 * @param {BrowserWindow} window - an electron window
 * @returns {Promise<string>}
 */
export async function getHTMLFromWindow(
	window: BrowserWindow
): Promise<string> {
	return window.webContents
		.executeJavaScript(`document.documentElement.innerHTML`)
		.then((html) => String(html))
}

export async function getImageBuffer(
	imageURL: string,
	userAgent: string
): Promise<Buffer> {
	return axios
		.get(imageURL, {
			responseType: "arraybuffer",
			headers: { "User-Agent": userAgent },
		})
		.then((response) => Buffer.from(response.data, "binary"))
}

/**
 *  Send data from main to renderer
 *
 * 	@param {...any} args - things to send to the renderer process
 *  @returns {void}
 */
export function m2r(m2rArgs: M2RArgs): void {
	mainWindow?.webContents.send("m2r", m2rArgs)
}

/**
 * Creates a download card and return the uuid of it and a function that updates the card.
 *
 * @param {any} downloadCardData - download card data
 * @returns {[(key: $Keys<IDownloadCardProps>, value: any) => void, string]}
 */
export function createDownloadCard(
	downloadCardData: Required<Optional<IDownloadCardProps>, "platform">
): [(key: $Keys<IDownloadCardProps>, value: any) => void, string] {
	const downloadCardID = randomUUID()

	m2r({
		type: "download",
		payload: {
			action: "new",
			payload: {
				downloadCardID: downloadCardID,
				data: downloadCardData,
			},
		},
	})

	return [
		(key: $Keys<IDownloadCardProps>, value: any) => {
			m2r({
				type: "download",
				payload: {
					action: "update",
					payload: { downloadCardID: downloadCardID, key, value },
				},
			})
		},
		downloadCardID,
	]
}

export function getPlatformType(downloadPayload: DownloadPayload): platformID {
	const parsedURL = new URL(downloadPayload.url)
	return parsedURL.hostname.replace("www.", "") as platformID
}
