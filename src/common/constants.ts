import { DownloadPayload } from "./ipcTypes"

/**
 * [User Agent](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/User-Agent) for Mocha Downloader
 */
export const userAgent =
	// todo: get user agent from electron
	"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/96.0.4664.93 Safari/537.36"

/**
 * Path where Mocha Downloader will put all its files.
 * Must not end with a slash
 */
export const mochaPath = "./mocha"

/**
 * Platform metadata.
 *
 * @interface
 */
export interface PlatformMeta {
	id: platformID // unique identifier of the platform. domain name for sites.
	code: platformCode // a 2~3 letter code to be used instead of the id
}

/**
 * Required exports of a platform file
 *
 * @interface
 */
export interface Platform {
	meta: PlatformMeta
	logic(payload: DownloadPayload): Promise<void>
	test(...args: string[]): Promise<void>
}

/**
 * Download card arguments
 *
 * @interface
 */
export interface IDownloadCardProps {
	downloadCardID: string

	platform: platformID // the source of the downloading content
	title: string
	thumbnail: string | Buffer

	status: string // what the downloader currently doing
	errorMessage: string
	unit: string // unit of the amount values below
	totalAmount: number
	amountComplete: number
	isDownloadComplete: boolean // is everything completely done
}

/**
 * @type available Locale
 */
export type Locale = "en" | "ko"

export interface Dict<T> {
	[key: string]: T
}

export interface ISelectOption {
	title: string
	url: string
}

export type platformID =
	| "unknown" // Not a valid platform
	| "comic.naver.com"
	| "youtube.com"
	| "bittorrent"

export type platformCode = "nv" | "yt" | "tr"
