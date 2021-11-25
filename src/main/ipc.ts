import { ipcMain, IpcMainEvent } from "electron"
import isDev from "electron-is-dev"
import { URL } from "url"

import { mainWindow } from "./main"
import platforms from "./platforms"

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

	mainWindow?.webContents.send("m2r", "download")

	if (parsedURL.hostname == "comic.naver.com") {
		if (parsedURL.pathname == "/webtoon/detail") {
			platforms.comicNaverCom.downloadEpisode(url)
			return
		}

		if (parsedURL.pathname == "/webtoon/list") {
			if (!selected || selected.length <= 0) {
				const selectable = await platforms.comicNaverCom.getList(url)
				event.reply("m2r", "select", url, selectable)
				return
			}

			platforms.comicNaverCom.downloadEpisodes(url, selected)
			return
		}
	}

	throw Error("Unsupported platform")
}
