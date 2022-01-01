import { Locale, mochaPath } from "../common/constants"
import { existsSync, readFileSync, statSync, writeFileSync } from "fs"
import { recursiveMkdir } from "./util"

const settingsPath = `${mochaPath}/settings.json`

export type Settings = {
	locale: Locale
}

export let settings: Settings = {
	locale: "en",
}

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

	// todo: check if settings is valid

	settings = JSON.parse(fileContent) as Settings
}

export async function saveSettings(): Promise<void> {
	// todo: failed to save settings feedback
	// todo: prettify string

	await recursiveMkdir(mochaPath)
	writeFileSync(settingsPath, JSON.stringify(settings))
}
