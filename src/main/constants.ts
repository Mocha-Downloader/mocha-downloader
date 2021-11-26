export interface DownloadFlags {
	dryRun: boolean
}

export interface PlatformMeta {
	id: string
}

export interface Platform {
	meta: PlatformMeta
	logic(...args: any): void
}
