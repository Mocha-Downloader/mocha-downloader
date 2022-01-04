/**
 * @file The entry point of the application.
 */

import "core-js/stable"
import "regenerator-runtime/runtime"

import { app, BrowserWindow, Menu, session, shell, Tray } from "electron"
import { autoUpdater } from "electron-updater"
import log from "electron-log"
import i18n, { t } from "i18next"
import path from "path"

import locales, { defaultLang } from "../common/locales"
import { userAgent } from "../common/constants"
import { isDev } from "./constants" // must come before other `main/` files for the app to work properly

import "./ipc"
import MenuBuilder from "./menu"
import { getAssetPath, resolveHtmlPath, m2r } from "./util"

i18n.init({
	resources: locales,
	lng: defaultLang,
	fallbackLng: defaultLang,
})

class AppUpdater {
	constructor() {
		log.transports.file.level = "info"
		autoUpdater.logger = log
		autoUpdater.checkForUpdatesAndNotify()
	}
}

new AppUpdater()

export let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null
let isQuitting = false // set this to true when the app is closing for real

export function buildTray() {
	tray?.destroy()
	tray = new Tray(getAssetPath("icon.png"))

	tray.setContextMenu(
		Menu.buildFromTemplate([
			{
				label: t("appName"),
				enabled: false,
			},
			{
				label: t("tray.show"),
				click: () => {
					if (mainWindow) mainWindow.show()
				},
			},
			{
				label: t("tray.about"),
				click: () => {
					m2r({ type: "showAbout" })
					if (mainWindow) mainWindow.show()
				},
			},
			{
				label: t("tray.quit"),
				click: () => {
					isQuitting = true
					app.quit()
				},
			},
		])
	)
}

if (isDev) {
	require("electron-debug")()
} else {
	require("source-map-support").install()
}

const installExtensions = async () => {
	const installer = require("electron-devtools-installer")
	const forceDownload = !!process.env.UPGRADE_EXTENSIONS
	const extensions = ["REACT_DEVELOPER_TOOLS"]

	return installer.default(
		extensions.map((name) => installer[name]),
		forceDownload
	)
}

const createWindow = async () => {
	if (isDev) await installExtensions()

	mainWindow = new BrowserWindow({
		show: false,
		width: 1000,
		height: 600,
		minWidth: 768,
		minHeight: 300,
		icon: getAssetPath("icon.png"),
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	})

	new MenuBuilder(mainWindow).buildMenu()

	// Open urls in the user's browser instead of the electron window
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url)
		return { action: "deny" }
	})

	mainWindow.loadURL(resolveHtmlPath("index.html"))

	/**
	 * Add event listeners
	 */

	mainWindow.on("ready-to-show", () => {
		if (!mainWindow) throw new Error('"mainWindow" is not defined')

		process.env.START_MINIMIZED ? mainWindow.minimize() : mainWindow.show()
	})

	mainWindow.on("close", (e) => {
		if (isQuitting) return

		if (mainWindow) {
			e.preventDefault()
			mainWindow.hide()
		}
	})
}

/**
 * Add event listeners
 */

app.whenReady().then(() => {
	// set user agent
	session.defaultSession.webRequest.onBeforeSendHeaders(
		(details, callback) => {
			details.requestHeaders["User-Agent"] = userAgent
			callback({ cancel: false, requestHeaders: details.requestHeaders })
		}
	)

	createWindow()
	buildTray()
})
