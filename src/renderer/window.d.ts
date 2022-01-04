/**
 * @file types for APIs exposed in the preload script.
 * Check the `src/main/preload.js` for the actual logic.
 */

import { IpcRenderer } from "electron"

import { M2RArgs, R2MArgs } from "../common/ipcTypes"

export {}

declare global {
	interface Window {
		electron: {
			// whether the app is running in development mode or not (production)
			isDev: boolean

			// application version
			appVersion: string

			// open directory with OS's default application
			// Windows: file explorer
			// Linux: nautilus, dolphin, nemo, etc.
			// Mac: finder
			openDirectory(path: string): void

			// read text in computer's clipboard
			readClipboardText(): string

			// ipc renderer related functions
			ipcRenderer: {
				// asynchronously send data to the main process
				send(r2mArgs: R2MArgs): Promise<void>

				// attach a listener that runs when the ipc receives a message from the main process
				on(listener: (m2rArgs: M2RArgs) => void): IpcRenderer
			}
		}
	}
}
