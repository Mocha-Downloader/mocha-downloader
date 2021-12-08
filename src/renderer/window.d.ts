/**
 * @file typing for APIs exposed in the preload script,
 */

import { IpcRenderer } from "electron"

import { M2RArgs, R2MArgs } from "common/ipcTypes"

export {}

declare global {
	interface Window {
		electron: {
			isDev: boolean
			data: {
				appVersion: string
				os: {
					platform: NodeJS.Platform
					arch: string
					release: string
				}
			}
			readClipboardText(): string
			ipcRenderer: {
				on(listener: (m2rArgs: M2RArgs) => void): IpcRenderer
				send(r2mArgs: R2MArgs): void
			}
		}
	}
}
