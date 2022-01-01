import { app, BrowserWindow } from "electron"
import { Required, Optional, $Keys } from "utility-types"
import { randomUUID } from "crypto"
import { URL } from "url"
import axios from "axios"
import path from "path"
import fs from "fs"

import { IDownloadCardProps, userAgent } from "../common/constants"
import { M2RArgs } from "../common/ipcTypes"

import { mainWindow } from "./main"
import { DownloadControl, downloadPool } from "./downloading"

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

export async function getImageBuffer(imageURL: string): Promise<Buffer> {
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
 * @returns {[(key: $Keys<IDownloadCardProps>, value: any) => void, string]} download card updater and download card UUID
 */
export function createDownloadCard(
	downloadCardData: Required<Optional<IDownloadCardProps>, "platform">,
	downloadControl: DownloadControl
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

	// todo: type hinting for value
	const updateDownloadCard = (key: $Keys<IDownloadCardProps>, value: any) => {
		m2r({
			type: "download",
			payload: {
				action: "update",
				payload: { downloadCardID: downloadCardID, key, value },
			},
		})
	}

	downloadPool[downloadCardID] = {
		pause: downloadControl.pause,
		resume: downloadControl.resume,
		stop: () => {
			updateDownloadCard("isDownloadComplete", true)
			delete downloadPool[downloadCardID]
			downloadControl.stop()
		},
	}

	return [updateDownloadCard, downloadCardID]
}

/**
 * Create directory recursively.
 *
 * @param {string} path - path of directory to create.
 * @returns {Promise<void>}
 */
export async function recursiveMkdir(path: string): Promise<void> {
	fs.promises.mkdir(path, { recursive: true })
}
