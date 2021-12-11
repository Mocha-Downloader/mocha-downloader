import axios, { AxiosResponse } from "axios"
import { createWriteStream } from "fs"

import { Platform, PlatformMeta, userAgent } from "../../common/constants"
import { DownloadPayload } from "../../common/ipcTypes"
import { createDownloadCard } from "../../main/util"
import { Stream } from "stream"

const meta: PlatformMeta = {
	id: "file",
	code: "f",
}

/**
 * Converts URL to filename
 *
 * @param {string} url - URL to be converted
 * @returns {string} generated filename
 */
function url2Filename(url: string): string {
	// todo: add "(n)" after filename if it already exists
	const parsedURL = new URL(url)

	while (true) {
		// remove trailing slashes
		if (parsedURL.pathname.endsWith("/")) {
			parsedURL.pathname = parsedURL.pathname.slice(
				0,
				parsedURL.pathname.length - 1
			)
			continue
		}

		// get string after slash
		return (
			parsedURL.pathname.slice(parsedURL.pathname.lastIndexOf("/") + 1) ||
			"file"
		)
	}
}

export async function downloadFile(url: string): Promise<any> {
	const [updateDownloadCard] = createDownloadCard(
		{
			platform: meta.id,
			unit: "MB",
		},
		{
			pause() {},
			resume() {},
			stop() {},
		}
	)

	const fileName = url2Filename(url)
	const writer = createWriteStream(fileName)

	updateDownloadCard("title", fileName)

	axios({
		url: url,
		method: "GET",
		responseType: "stream",
		headers: { "User-Agent": userAgent },
		onDownloadProgress: (progressEvent) => {
			const total = parseFloat(
				progressEvent.currentTarget.responseHeaders["Content-Length"]
			)
			const current = progressEvent.currentTarget.response.length

			let percentCompleted = Math.floor((current / total) * 100)
			console.log("completed: ", percentCompleted)
		},
	}).then((response: AxiosResponse<Stream>) => {
		response.data.pipe(writer)
	})
}

async function logic(payload: DownloadPayload): Promise<void> {
	downloadFile(payload.data)
}

async function test(): Promise<void> {}

export default { meta, logic, test } as Platform
