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
			timeout: 1000,
			responseType: "arraybuffer",
			headers: { "User-Agent": userAgent },
		})
		.then((response) => Buffer.from(response.data, "binary"))
}

/**
 *  Send data from main to renderer
 */
export async function m2r(...args: any[]) {
	mainWindow?.webContents.send("m2r", ...args)
}
