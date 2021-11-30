/**
 * @file Manages communication between the main process and the renderer process
 */

import { ipcMain } from "electron"
import isDev from "electron-is-dev"
import { changeLanguage } from "i18next"
import { URL } from "url"

import { Platform } from "common/constants"
import { R2MArgs } from "common/ipcTypes"

import platforms from "./platforms"
import { buildTray } from "./main"

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

ipcMain.on("r2m", async (_, r2mArgs: R2MArgs) => {
	if (isDev) console.log("r2m:", r2mArgs)

	switch (r2mArgs.type) {
		case "download": {
			if (isDev) {
				const tokens = r2mArgs.payload.url.split(" ")

				testInput(tokens[0], ...tokens.slice(1, tokens.length))
				return
			}

			const parsedURL = new URL(r2mArgs.payload.url)

			forEachPlatform((platform) => {
				if (platform.meta.id === parsedURL.hostname) {
					platform.logic(parsedURL, r2mArgs.payload.selected)
					return true
				}
				return
			})

			// code should not reach this point if everything goes well
			throw Error("Unsupported platform")
			// todo: user feedback
		}

		case "changeLang": {
			changeLanguage(r2mArgs.payload)
			buildTray()
		}
	}
})
