/**
 * @file Manages communication between the main process and the renderer process
 */

import { ipcMain } from "electron"
import { changeLanguage } from "i18next"

import { Platform } from "common/constants"
import { R2MArgs } from "common/ipcTypes"

import platforms from "./platforms"
import { isDev, buildTray } from "./main"
import { getPlatformType } from "./util"

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
 * @argument {string} input - Raw test string to be parsed.
 *
 * @returns {boolean} Returns true if input is a valid test code. Returns false otherwise.
 */
function testInput(input: string): boolean {
	const [platformCode, ...strings] = input.split(" ")
	let wasMatchFound = false

	forEachPlatform((platform) => {
		if (platform.meta.code !== platformCode) return

		wasMatchFound = true
		platform.test(...strings)
	})

	return wasMatchFound
}

ipcMain.on("r2m", async (_, r2mArgs: R2MArgs) => {
	if (isDev) console.log("r2m:", r2mArgs)

	switch (r2mArgs.type) {
		case "download": {
			if (isDev && testInput(r2mArgs.payload.url)) return

			const platformType = getPlatformType(r2mArgs.payload)

			forEachPlatform((platform) => {
				if (platform.meta.id === platformType) {
					platform.logic(r2mArgs.payload)
					return true
				}
				return
			})

			// code should not reach this point if everything goes well
			throw Error(
				`Unsupported platform ${platformType} (${r2mArgs.payload.url})`
			)
		}

		case "changeLang": {
			changeLanguage(r2mArgs.payload)
			buildTray()
		}
	}
})
