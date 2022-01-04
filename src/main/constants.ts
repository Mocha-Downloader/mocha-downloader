import { app } from "electron"

export const isDev =
	process.env.NODE_ENV !== "production" || process.env.DEBUG_PROD === "true"

/**
 * Path where Mocha Downloader will put all its files.
 * Does not end with a slash.
 */
export const mochaPath = `${app.getPath("downloads")}/mocha`
