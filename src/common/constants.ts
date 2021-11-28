// main process

export interface DownloadFlags {
	dryRun: boolean
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

export interface Platform {
	meta: PlatformMeta
	logic(...args: any): void
	test(...args: any): void
}

// renderer

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

export type platformID =
	| "comic.naver.com"
	| "youtube.com"
	| "bittorrent"
	| "webtoon.kakao.com"

export const platformID2NameMap: { [key in platformID]: string } = {
	"comic.naver.com": "Naver Comics",
	"youtube.com": "YouTube",
	bittorrent: "Torrent",
	"webtoon.kakao.com": "Kakao Webtoon",
}
