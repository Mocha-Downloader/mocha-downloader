import { app, BrowserWindow, dialog, clipboard } from "electron"
import isDev from "electron-is-dev"
import { URL } from "url"
import axios from "axios"
import path from "path"
import os from "os"
import { mainWindow } from "./main"

// -----

export let resolveHtmlPath: (htmlFileName: string) => string

if (isDev) {
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

// -----

export function getAssetPath(...paths: string[]): string {
	return path.join(
		app.isPackaged
			? path.join(process.resourcesPath, "assets")
			: path.join(__dirname, "../../assets"),
		...paths
	)
}

export function showAbout() {
	// known bug: https://github.com/electron/electron/issues/7085

	const aboutContent = `A GUI tool for searching, parsing, and downloading contents from the web.

Version: ${app.getVersion()}
OS: ${os.platform()} ${os.arch()} ${os.release()}

License: https://mocha-downloader.github.io/docs/licenses
`

	const choice = dialog.showMessageBoxSync({
		type: "info",
		message: "About Mocha Downloader",
		title: "About Mocha Downloader",
		detail: aboutContent,
		buttons: ["Copy", "Ok"],
	})

	// copy to clipboard
	if (choice === 0) clipboard.writeText(aboutContent)
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
export function m2r(...args: any[]): void {
	mainWindow?.webContents.send("m2r", ...args)
}

type DownloadCardKey =
	| "platform"
	| "title"
	| "thumbnail"
	| "status"
	| "totalAmount"
	| "amountComplete"
	| "isDownloadComplete"

/**
 * Creates a function that updates a specific download card in the renderer process.
 *
 * @param {string} downloadCardID - download card identifier
 * @returns {(DownloadCardKey, any) => void}
 */
export function makeUpdateDownloadCard(
	downloadCardID: string
): (key: DownloadCardKey, value: any) => void {
	return (key: DownloadCardKey, value: any) => {
		m2r("download", "update", downloadCardID, key, value)
	}
}
