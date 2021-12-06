import {
	app,
	BrowserWindow,
	Menu,
	MenuItemConstructorOptions,
	shell,
} from "electron"
import { isDev } from "./main"

import { m2r } from "./util"

interface DarwinMenuItemConstructorOptions extends MenuItemConstructorOptions {
	selector?: string
	submenu?: DarwinMenuItemConstructorOptions[] | Menu
}

export default class MenuBuilder {
	mainWindow: BrowserWindow

	constructor(mainWindow: BrowserWindow) {
		this.mainWindow = mainWindow
	}

	buildMenu(): Menu {
		if (isDev) this.setupDevelopmentEnvironment()

		const template = [
			...(process.platform === "darwin"
				? this.buildDarwinTemplate()
				: []),
			{
				label: "File",
				submenu: [
					{
						label: "Load batch",
						accelerator: "Ctrl+L",
					},
					{
						label: "Close",
						accelerator: "Ctrl+W",
						click: () => {
							this.mainWindow.close()
						},
					},
				],
			},
			{
				label: "Help",
				submenu: [
					{
						label: "Source Code",
						click: () => {
							shell.openExternal(
								"https://github.com/Mocha-Downloader/mocha-downloader"
							)
						},
					},
					{
						label: "Documentation",
						click: () => {
							shell.openExternal(
								"https://mocha-downloader.github.io"
							)
						},
					},
					{
						label: "Bug report / Feature suggestion",
						click: () => {
							shell.openExternal(
								"https://github.com/Mocha-Downloader/mocha-downloader/issues"
							)
						},
					},
					{
						label: "Discord",
						click: () => {
							shell.openExternal("https://discord.gg/aQqamSCUcS")
						},
					},
					{
						label: "About",
						click: () => {
							m2r({ type: "showAbout" })
						},
					},
				],
			},
		]
		const menu = Menu.buildFromTemplate(template)
		Menu.setApplicationMenu(menu)

		return menu
	}

	setupDevelopmentEnvironment() {
		this.mainWindow.webContents.on("context-menu", (_, props) => {
			const { x, y } = props

			Menu.buildFromTemplate([
				{
					label: "Inspect element",
					click: () =>
						this.mainWindow.webContents.inspectElement(x, y),
				},
			]).popup({ window: this.mainWindow })
		})
	}

	buildDarwinTemplate(): MenuItemConstructorOptions[] {
		const subMenuAbout: DarwinMenuItemConstructorOptions = {
			label: "Mocha Downloader",
			submenu: [
				{
					label: "About Mocha Downloader",
					selector: "orderFrontStandardAboutPanel:",
				},
				{ type: "separator" },
				{ label: "Services", submenu: [] },
				{ type: "separator" },
				{
					label: "Hide Mocha Downloader",
					accelerator: "Command+H",
					selector: "hide:",
				},
				{
					label: "Hide Others",
					accelerator: "Command+Shift+H",
					selector: "hideOtherApplications:",
				},
				{ label: "Show All", selector: "unhideAllApplications:" },
				{ type: "separator" },
				{
					label: "Quit",
					accelerator: "Command+Q",
					click: () => {
						app.quit()
					},
				},
			],
		}
		const subMenuWindow: DarwinMenuItemConstructorOptions = {
			label: "Window",
			submenu: [
				{
					label: "Minimize",
					accelerator: "Command+M",
					selector: "performMiniaturize:",
				},
				{
					label: "Close",
					accelerator: "Command+W",
					selector: "performClose:",
				},
				{ type: "separator" },
				{ label: "Bring All to Front", selector: "arrangeInFront:" },
			],
		}

		return [subMenuAbout, subMenuWindow]
	}
}
