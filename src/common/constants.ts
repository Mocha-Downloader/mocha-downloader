// main process

/**
 * Tweaks download behavior.
 *
 * @interface
 */
export interface DownloadFlags {
	dryRun: boolean // do not download the contents (still requires internet connection)
}

/**
 * Platform metadata.
 *
 * @interface
 */
export interface PlatformMeta {
	id: string // unique identifier of the platform. domain name for sites.
	code: string // a 2~3 letter code to be used instead of the id
}

/**
 * Required exports of a platform file
 *
 * @interface
 */
export interface Platform {
	meta: PlatformMeta
	logic(...args: any): Promise<void>
	test(...args: any): Promise<void>
}

// renderer

/**
 * Download card arguments
 *
 * @interface
 */
export interface IDownloadCardProps {
	keyValue: string // key value that can be access programmatically. react key values can not be accessed for some reason.

	platform: platformID // the source of the downloading content
	title: string
	thumbnail: string | Buffer

	status: string // what the downloader currently doing
	totalAmount: number
	amountComplete: number
	isDownloadComplete: boolean // is everything completely done
}

// common

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
	| "comic.naver.com"
	| "youtube.com"
	| "bittorrent"
	| "webtoon.kakao.com"
