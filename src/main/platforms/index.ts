import comicNaverCom from "./comic.naver.com"
import youtubeCom from "./youtube.com"
import torrent from "./torrent"

import { Platform, platformID } from "../../common/constants"
import { DownloadPayload } from "../../common/ipcTypes"

const platforms = { comicNaverCom, youtubeCom, torrent }

// check for duplicate platform ids and codes
// wrapped in a scope so the variables get garbage collected
{
	const safeIDs: string[] = []
	const safeCodes: string[] = []

	const duplicateIDs: Set<string> = new Set()
	const duplicateCodes: Set<string> = new Set()

	Object.entries(platforms).forEach(([_, platform]) => {
		if (safeIDs.includes(platform.meta.id))
			duplicateIDs.add(platform.meta.id)
		safeIDs.push(platform.meta.id)

		if (safeCodes.includes(platform.meta.code))
			duplicateCodes.add(platform.meta.code)
		safeCodes.push(platform.meta.code)
	})

	if (duplicateIDs.size > 0) {
		throw new Error(
			`Duplicate platform IDs were found: ${new Array(
				...duplicateIDs
			).join(", ")}`
		)
	}

	if (duplicateCodes.size > 0) {
		throw new Error(
			`Duplicate platform codes were found: ${new Array(
				...duplicateCodes
			).join(", ")}`
		)
	}
}

export default platforms

/**
 * loops over each platform until the callback returns a truthy value.
 * WARNING: [truthy](https://developer.mozilla.org/en-US/docs/Glossary/Truthy) and [falsy](https://developer.mozilla.org/en-US/docs/Glossary/Falsy) values might not be as intuitive as you think. For example, an empty array is truthy in javascript.
 *
 * @template {any} T - type of return value of the callback function
 * @param {function(Platform): T | undefined} f - callback function
 */
export function forEachPlatform<T>(
	f: (platform: Platform) => T | undefined
): void {
	for (const key in platforms) {
		// @ts-ignore
		if (f(platforms[key] as Platform)) return
	}
}

/**
 * Identifies download payload's content type.
 *
 * @param {DownloadPayload} data - The type of payload to identify
 * @returns {platformID} the type of platform
 */
export function getPlatformType(data: DownloadPayload): platformID {
	// throw new Error("Failed to recognize platform type")
	if (data.data === "") return "unknown"

	if (data.data.startsWith("magnet")) return "bittorrent"

	try {
		const parsedURL = new URL(data.data)
		return parsedURL.hostname.replace("www.", "") as platformID
	} catch {
		return "unknown"
	}
}
