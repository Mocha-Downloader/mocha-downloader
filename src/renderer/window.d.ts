import { IpcRenderer } from "electron"

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
			ipcRenderer: {
				// check src/main/preload.js for more info
				on(listener: (...args: any[]) => void): IpcRenderer
				once(listener: (...args: any[]) => void): IpcRenderer
				send(...args: any[]): void
				sendSync(...args: any[]): any
			}
		}
	}
}
