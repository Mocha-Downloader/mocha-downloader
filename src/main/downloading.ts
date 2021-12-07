/**
 * @file Manages download pool
 */

interface DownloadControl {
	pause(): void
	resume(): void
	stop(): void
}

// maps UUID to download controllable
export const downloadPool: { [key: string]: DownloadControl } = {}
