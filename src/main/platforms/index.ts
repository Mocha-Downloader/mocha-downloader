import comicNaverCom from "./comic.naver.com"
import youtubeCom from "./youtube.com"
import torrent from "./torrent"
import { Platform } from "common/constants"

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
 */
export function forEachPlatform<T>(
	f: (platform: Platform) => T | undefined
): void {
	for (const key in platforms) {
		// @ts-ignore
		if (f(platforms[key] as Platform)) return
	}
}
