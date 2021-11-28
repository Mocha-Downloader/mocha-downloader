import { ipcMain } from "electron"
import isDev from "electron-is-dev"
import { URL } from "url"

import platforms from "./platforms"

import { Platform } from "common/constants"

// todo: add support for .torrent and .json files and magnet link
// todo: add name collision for platform id and code

/**
 * loops over each platform until the callback returns a truthy value.
 * WARNING: {@link https://developer.mozilla.org/en-US/docs/Glossary/Truthy truthy} and {@link https://developer.mozilla.org/en-US/docs/Glossary/Falsy falsy} values might not be as intuitive as you think. For example, an empty array is truthy in javascript.
 */
function forEachPlatform<T>(f: (platform: Platform) => T | undefined): void {
	for (const key in platforms) {
		// @ts-ignore
		if (f(platforms[key] as Platform)) return
	}
}

/**
 *  Quickly test features without having to paste link or drag & drop files.
 *
 * @argument {string} platform - A short string ideally 2-3 characters ideantifying which platform to test for
 * @argument {string[]} args - additional options for a more specific action
 */
let testInput: (platformCode: string, ...args: string[]) => void

if (isDev) {
	testInput = (platformCode: string, ...args: string[]) => {
		forEachPlatform((platform) => {
			if (platform.meta.code == platformCode) {
				platform.test(...args)
				return true
			}
			return
		})
	}
}

ipcMain.on("r2m", async (_, ...args) => {
	if (isDev) {
		console.log("r2m:", args)

		const tokens = String(args[1]).split(" ")

		testInput(tokens[0], ...tokens.slice(1, tokens.length))
		return
	}

	if (args[0] == "download") {
		Download(args[1], args[2])
	}
})

async function Download(url: string, selected?: number[]): Promise<void> {
	const parsedURL = new URL(url)

	forEachPlatform((platform) => {
		if (platform.meta.id === parsedURL.hostname) {
			platform.logic(parsedURL, selected)
			return true
		}
		return
	})

	throw Error("Unsupported platform")
}
