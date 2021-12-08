/**
 * @file Manages download pool
 */

export interface DownloadControl {
	pause(): void
	resume(): void
	stop(): void
}

// maps UUID to download controllable
export const downloadPool: { [key: string]: DownloadControl } = {}
