import { $Keys, Optional, Required } from "utility-types"

import type { Settings } from "../main/settings"
import { TabEnum } from "../renderer/components/Tabs"
import { IDownloadCardProps, ISelectOption, Locale } from "./constants"

export enum ActionsEnum {
	SHOW_ABOUT_MODAL = "SHOW_ABOUT_MODAL",
	HIDE_ABOUT_MODAL = "HIDE_ABOUT_MODAL",

	SHOW_SELECT_OPTIONS = "SHOW_SELECT_OPTIONS",
	HIDE_SELECT_OPTIONS = "HIDE_SELECT_OPTIONS",
	SET_SELECT_OPTIONS = "SET_SELECT_OPTIONS",
	UPDATE_SELECT_OPTIONS = "UPDATE_SELECT_OPTIONS",

	ADD_DOWNLOAD_CARD = "ADD_DOWNLOAD_CARD",
	UPDATE_DOWNLOAD_CARD = "UPDATE_DOWNLOAD_CARD",
	REMOVE_DOWNLOAD_CARD = "REMOVE_DOWNLOAD_CARD",

	SET_TAB_INDEX = "SET_TAB_INDEX",
}

export interface ShowSelectOptionsPayload {
	url: string
	availableChoices: ISelectOption[]
}

export interface UpdateSelectOptionsPayload {
	index: number
	isSelected: boolean
}

export interface AddDownloadCardPayload {
	downloadCardID: string
	data: Required<Optional<IDownloadCardProps>, "platform">
}

export interface UpdateDownloadCardPayload {
	downloadCardID: string
	key: $Keys<IDownloadCardProps>
	value: any // todo: use values from IDownloadCardProps
}

export type GlobalAction =
	| {
			type: ActionsEnum.SHOW_ABOUT_MODAL
	  }
	| {
			type: ActionsEnum.HIDE_ABOUT_MODAL
	  }
	| {
			type: ActionsEnum.SHOW_SELECT_OPTIONS
			payload: ShowSelectOptionsPayload
	  }
	| {
			type: ActionsEnum.HIDE_SELECT_OPTIONS
	  }
	| {
			type: ActionsEnum.SET_SELECT_OPTIONS
			payload: boolean[]
	  }
	| {
			type: ActionsEnum.UPDATE_SELECT_OPTIONS
			payload: UpdateSelectOptionsPayload
	  }
	| {
			type: ActionsEnum.ADD_DOWNLOAD_CARD
			payload: AddDownloadCardPayload
	  }
	| {
			type: ActionsEnum.UPDATE_DOWNLOAD_CARD
			payload: UpdateDownloadCardPayload
	  }
	| {
			type: ActionsEnum.REMOVE_DOWNLOAD_CARD
			payload: string
	  }
	| {
			type: ActionsEnum.SET_TAB_INDEX
			payload: TabEnum
	  }

export type M2RArgs =
	| {
			type: "settings"
			payload: Settings
	  }
	| {
			type: "showAbout"
	  }
	| {
			type: "select"
			payload: {
				url: string
				availableChoices: ISelectOption[]
			}
	  }
	| {
			type: "download"
			payload:
				| {
						action: "new"
						payload: AddDownloadCardPayload
				  }
				| {
						action: "update"
						payload: UpdateDownloadCardPayload
				  }
	  }

export type DownloadOptions = {
	selected?: number[]
}

export type DownloadPayload = {
	data: string // either a url or a file content
	options?: DownloadOptions
}

export type FileDropPayload = string // file content as string

export type downloadControlPayload = {
	type: "pause" | "resume" | "stop"
	downloadCardID: string
}

export type SettingsPayload =
	// load settings
	| {
			type: "load"
	  }

	// save settings
	| {
			type: "save"
	  }

export type R2MArgs =
	// file drop or paste button click
	| {
			type: "download"
			payload: DownloadPayload
	  }

	// file drag and drop
	| {
			type: "fileDrop"
			payload: FileDropPayload
	  }

	// pause, resume, stop
	| {
			type: "downloadControl"
			payload: downloadControlPayload
	  }

	// change locale
	| {
			type: "changeLang"
			payload: Locale
	  }

	// Mocha Downloader settings
	| {
			type: "settings"
			payload: SettingsPayload
	  }
