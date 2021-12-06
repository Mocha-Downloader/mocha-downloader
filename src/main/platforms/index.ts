import comicNaverCom from "./comic.naver.com"
import youtubeCom from "./youtube.com"
import torrent from "./torrent"

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
