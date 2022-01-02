import { forEachPlatform, getPlatformType } from "./platforms"

import { DownloadPayload } from "../common/ipcTypes"
import { isDev } from "./main"
import { m2r } from "./util"

/**
 * Quickly test features without having to paste link or drag & drop files.
 *
 * @param {string} input - Raw test string to be parsed.
 * @returns {boolean} Returns true if input is a valid test code. Returns false otherwise.
 */
function testInput(input: string): boolean {
	const [platformCode, ...strings] = input.split(" ")
	let wasMatchFound = false

	forEachPlatform((platform) => {
		if (platform.meta.code === platformCode) {
			wasMatchFound = true
			platform.test(...strings)
			return true
		}
		return false
	})

	return wasMatchFound
}

export default function downloadLogic(data: DownloadPayload) {
	if (isDev && testInput(data.data)) return

	const platformType = getPlatformType(data)

	let wasMatchFound = false
	forEachPlatform((platform) => {
		if (platform.meta.id === platformType) {
			platform.logic(data)
			wasMatchFound = true
			return true
		}
		return false
	})

	if (!wasMatchFound) {
		m2r({
			type: "unsupported platform",
			payload: data.data,
		})
	}
}
