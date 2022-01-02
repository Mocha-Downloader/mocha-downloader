import {
	defaultSettings,
	Locale,
	mochaPath,
	Settings,
} from "../common/constants"
import { existsSync, readFileSync, statSync, writeFileSync } from "fs"
import { m2r, recursiveMkdir } from "./util"
import { buildTray, isDev } from "./main"
import { changeLanguage } from "i18next"

const settingsPath = `${mochaPath}/settings.json`

export let settings: Settings = defaultSettings

// todo: watch settings file and apply changes instantly (allow manual editing)

export async function loadSettings(): Promise<void> {
	if (isDev) console.log("loading settings!")

	// create file if it doesn't exist
	if (!existsSync(settingsPath)) {
		await saveSettings()
	}

	// check if path is a file
	if (!(await statSync(settingsPath)).isFile())
		throw new Error("settings.json should be a file.")

	const fileContent = readFileSync(settingsPath, "utf-8")

	// todo: check if settings are valid

	// generate settings and run again if file is empty
	if (!fileContent) {
		await saveSettings()
		await loadSettings()

		return
	}

	settings = JSON.parse(fileContent) as Settings

	changeLangTo(settings.locale)

	// send parsed result to front end
	m2r({
		type: "settings",
		payload: settings,
	})
}

export async function saveSettings(): Promise<void> {
	if (isDev) console.log("Saving settings!")

	// todo: failed to save settings feedback
	// todo: prettify string

	recursiveMkdir(mochaPath).then(() => {
		const settingsJSON = JSON.stringify(settings)

		if (isDev) console.log("Saving settings:", settingsJSON)

		writeFileSync(settingsPath, settingsJSON || "")
	})
}

export async function changeLangTo(lang: Locale): Promise<void> {
	if (isDev) console.log("changing language to: ", lang)

	settings.locale = lang
	changeLanguage(lang)
	buildTray()
}
