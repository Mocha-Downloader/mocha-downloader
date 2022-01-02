import { Locale, mochaPath, Settings } from "../common/constants"
import { existsSync, readFileSync, statSync, writeFileSync } from "fs"
import { m2r, recursiveMkdir } from "./util"
import { buildTray } from "./main"
import { changeLanguage } from "i18next"

const settingsPath = `${mochaPath}/settings.json`

export let settings: Settings

// todo: watch settings file and apply changes instantly (allow manual editing)

export async function loadSettings(): Promise<void> {
	// create file if it doesn't exist
	if (!existsSync(settingsPath)) {
		await saveSettings()
	}

	// check if path is a file
	if (!(await statSync(settingsPath)).isFile())
		throw new Error("settings.json should be a file.")

	const fileContent = readFileSync(settingsPath, "utf-8")

	// todo: check if settings are valid

	settings = JSON.parse(fileContent) as Settings

	changeLangTo(settings.locale)

	// send parsed result to front end
	m2r({
		type: "settings",
		payload: settings,
	})
}

export async function saveSettings(): Promise<void> {
	// todo: failed to save settings feedback
	// todo: prettify string

	await recursiveMkdir(mochaPath)
	writeFileSync(settingsPath, JSON.stringify(settings))
}

export async function changeLangTo(lang: Locale): Promise<void> {
	settings.locale = lang
	changeLanguage(lang)
	buildTray()
}
