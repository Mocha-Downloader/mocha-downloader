/**
 * @file The entry point of the application.
 */

import "core-js/stable"
import "regenerator-runtime/runtime"

import { app, BrowserWindow, Menu, shell, Tray } from "electron"
import { autoUpdater } from "electron-updater"
import { start } from "pretty-error"
import isDev from "electron-is-dev"
import log from "electron-log"
import i18n, { t } from "i18next"
import path from "path"

import locales, { defaultLang } from "../common/locales"

import "./ipc"
import MenuBuilder from "./menu"
import { getAssetPath, resolveHtmlPath, showAbout } from "./util"

// apply pretty error print to all errors
start()

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

export let mainWindow: BrowserWindow | null = null
let tray: Tray | null = null

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
				label: t("tray.about"),
				click: () => {
					showAbout()
				},
			},
			{
				label: t("tray.quit"),
				click: () => {
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

	return installer
		.default(
			extensions.map((name) => installer[name]),
			forceDownload
		)
		.catch(console.log)
}

const createWindow = async () => {
	if (isDev) await installExtensions()

	mainWindow = new BrowserWindow({
		show: false,
		width: 1000,
		height: 600,
		minWidth: 700,
		minHeight: 300,
		icon: getAssetPath("icon.png"),
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
		},
	})

	mainWindow.loadURL(resolveHtmlPath("index.html"))

	mainWindow.on("ready-to-show", () => {
		if (!mainWindow) throw new Error('"mainWindow" is not defined')

		process.env.START_MINIMIZED ? mainWindow.minimize() : mainWindow.show()
	})

	mainWindow.on("closed", () => {
		mainWindow = null
	})

	const menuBuilder = new MenuBuilder(mainWindow)
	menuBuilder.buildMenu()

	// Open urls in the user's browser
	mainWindow.webContents.setWindowOpenHandler(({ url }) => {
		shell.openExternal(url)
		return { action: "deny" }
	})

	new AppUpdater()
}

/**
 * Add event listeners
 */

app.whenReady().then(() => {
	buildTray()
	createWindow()

	// On macOS it's common to re-create a window in the app when the
	// dock icon is clicked and there are no other windows open.
	app.on("activate", () => {
		if (mainWindow === null) createWindow()
	})
})

app.on("window-all-closed", () => {
	// Respect the OSX convention of having the application in memory even
	// after all windows have been closed
	if (process.platform === "darwin") return

	app.quit()
})
