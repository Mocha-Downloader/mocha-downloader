import { ipcMain, IpcMainEvent } from "electron"
import isDev from "electron-is-dev"
import { URL } from "url"

import platforms from "./platforms"

import { Platform } from "./constants"

// todo: add support for .torrent and .json files and magnet link

ipcMain.on("r2m", async (event, ...args) => {
	// For testing purpose
	if (isDev) {
		console.log("r2m:", args)

		switch (args[1]) {
			case "1":
				// 신도림 개꿀잼
				Download(
					event,
					"https://comic.naver.com/webtoon/detail?titleId=683496&no=1"
				)
				break
			case "2":
				// 죽마도 약꿀잼
				Download(
					event,
					"https://comic.naver.com/webtoon/list?titleId=409629"
				)
				break
		}

		return
	}

	if (args[0] == "download") {
		Download(event, args[1], args[2])
	}
})

async function Download(
	event: IpcMainEvent,
	url: string,
	selected?: number[]
): Promise<void> {
	const parsedURL = new URL(url)

	for (const key in platforms) {
		// @ts-ignore
		const platform: Platform = platforms[key]

		if (platform.meta.id === parsedURL.hostname) {
			platform.logic(event, url, parsedURL, selected)

			break
		}
	}

	throw Error("Unsupported platform")
}
