import { existsSync, readFileSync, statSync, writeFileSync } from "fs"

const settingsPath = "settings.json"

export type Settings = {
	amICool: boolean
}

export let settings: Settings = {
	amICool: true,
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
	writeFileSync("settings.json", JSON.stringify(settings))
}
