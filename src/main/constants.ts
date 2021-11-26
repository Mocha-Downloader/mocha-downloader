export interface DownloadFlags {
	dryRun: boolean
}

/**
 * platform metadata
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
