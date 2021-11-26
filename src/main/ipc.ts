import { ipcMain } from "electron"
import isDev from "electron-is-dev"
import { URL } from "url"

import platforms from "./platforms"

import { Platform } from "./constants"

// todo: add support for .torrent and .json files and magnet link

ipcMain.on("r2m", async (_, ...args) => {
	// For testing purpose
	if (isDev) {
		console.log("r2m:", args)

		switch (args[1]) {
			case "1":
				// 신도림 개꿀잼
				Download(
					"https://comic.naver.com/webtoon/detail?titleId=683496&no=1"
				)
				break
			case "2":
				// 죽마도 약꿀잼
				Download("https://comic.naver.com/webtoon/list?titleId=409629")
				break
		}

		return
	}

	if (args[0] == "download") {
		Download(args[1], args[2])
	}
})

async function Download(url: string, selected?: number[]): Promise<void> {
	const parsedURL = new URL(url)

	for (const key in platforms) {
		// @ts-ignore
		const platform: Platform = platforms[key]

		if (platform.meta.id === parsedURL.hostname) {
			platform.logic(url, parsedURL, selected)

			break
		}
	}

	throw Error("Unsupported platform")
}
