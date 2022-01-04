/**
 * @file Handles global state and electron ipc.
 */

import {
	createContext,
	Dispatch,
	ReactElement,
	ReactNode,
	useEffect,
	useReducer,
} from "react"
import notification from "./notification"

import {
	defaultSettings,
	Dict,
	IDownloadCardProps,
	ISelectOption,
	Locale,
	Settings,
} from "../common/constants"
import { largeIcons } from "../common/platformIcons"
import { ActionsEnum, GlobalAction } from "../common/ipcTypes"
import { TabEnum } from "./components/Tabs"
import { changeLanguage } from "i18next"

interface IGlobalState {
	settings: Settings
	aboutModalVisibility: boolean
	locale: Locale
	tabIndex: TabEnum
	downloadCards: Dict<IDownloadCardProps>
	selectOptions: {
		isVisible: boolean
		url: string
		availableChoices: ISelectOption[]
		selectedChoices: boolean[]
	}
}

interface IContext {
	globalState: IGlobalState
	dispatch: Dispatch<GlobalAction>
}

const defaultState: IGlobalState = {
	settings: defaultSettings,
	aboutModalVisibility: false,
	locale: "en",
	tabIndex: TabEnum.DOWNLOAD,
	downloadCards: {},
	selectOptions: {
		isVisible: false,
		url: "",
		availableChoices: [],
		selectedChoices: [],
	},
}

const reducer = (state = defaultState, action: GlobalAction): IGlobalState => {
	switch (action.type) {
		case ActionsEnum.UPDATE_SETTINGS:
			// change settings

			state.settings = action.payload

			// and apply settings

			changeLanguage(action.payload.locale)
			break

		// about modal related
		case ActionsEnum.SHOW_ABOUT_MODAL:
			state.aboutModalVisibility = true
			break

		case ActionsEnum.HIDE_ABOUT_MODAL:
			state.aboutModalVisibility = false
			break

		// SelectOptions related

		case ActionsEnum.SHOW_SELECT_OPTIONS:
			state.selectOptions = {
				...state.selectOptions,

				isVisible: true,
				url: action.payload.url || state.selectOptions.url,
				availableChoices:
					action.payload.availableChoices ||
					state.selectOptions.availableChoices,
			}
			break
		case ActionsEnum.HIDE_SELECT_OPTIONS:
			state.selectOptions.isVisible = false
			break
		case ActionsEnum.SET_SELECT_OPTIONS:
			state.selectOptions.selectedChoices = action.payload || []
			break
		case ActionsEnum.UPDATE_SELECT_OPTIONS:
			state.selectOptions.selectedChoices[action.payload.index] =
				action.payload.isSelected
			break

		// downloadCard related

		case ActionsEnum.ADD_DOWNLOAD_CARD:
			// create a new card with default values
			state.downloadCards[action.payload.downloadCardID] = {
				downloadCardID: action.payload.downloadCardID,

				title: "",
				thumbnail: largeIcons[action.payload.data.platform], // placeholder image

				status: "initializing",
				errorMessage: "",
				unit: "",
				totalAmount: 0,
				amountComplete: 0,

				isDownloadComplete: false,

				downloadPath: "",

				...action.payload.data,
			}
			break
		case ActionsEnum.UPDATE_DOWNLOAD_CARD:
			const downloadCard =
				state.downloadCards[action.payload.downloadCardID]

			// stop if card doesn't exist
			if (!downloadCard) return { ...state }
			// stop if card doesn't have such property
			if (!downloadCard.hasOwnProperty(action.payload.key))
				return { ...state }

			// @ts-ignore
			// update property
			downloadCard[action.payload.key] = action.payload.value

			state.downloadCards[action.payload.downloadCardID] = downloadCard
			break
		case ActionsEnum.REMOVE_DOWNLOAD_CARD:
			delete state.downloadCards[action.payload]

			window.electron.ipcRenderer.send({
				type: "downloadControl",
				payload: {
					type: "stop",
					downloadCardID: action.payload,
				},
			})
			break

		// tabs related

		case ActionsEnum.SET_TAB_INDEX:
			state.tabIndex = action.payload
			break

		default:
			break
	}

	return { ...state }
}

export const globalContext = createContext({} as IContext)

export const GlobalStore = (props: { children: ReactNode }): ReactElement => {
	const [globalState, dispatch] = useReducer(reducer, defaultState)

	// this code runs only once
	// it's functionally the same as being in preload.js
	// I put it here because it has typescript support
	useEffect(() => {
		// load settings only once
		window.electron.ipcRenderer.send({
			type: "settings",
			payload: {
				type: "load",
			},
		})

		// register listener
		window.electron.ipcRenderer.on((m2rArgs) => {
			if (window.electron.isDev) console.log("m2r:", m2rArgs)

			switch (m2rArgs.type) {
				case "settings":
					dispatch({
						type: ActionsEnum.UPDATE_SETTINGS,
						payload: m2rArgs.payload,
					})
					break

				case "showAbout":
					dispatch({ type: ActionsEnum.SHOW_ABOUT_MODAL })
					break

				case "unsupported platform":
					notification.warning(
						"Platform not supported",
						`Unable to download from: "${m2rArgs.payload}"`
					)
					break

				case "select":
					// select all choices
					dispatch({
						type: ActionsEnum.SET_SELECT_OPTIONS,
						payload: Array(
							m2rArgs.payload.availableChoices.length
						).fill(true),
					})

					dispatch({
						type: ActionsEnum.SHOW_SELECT_OPTIONS,
						payload: m2rArgs.payload,
					})

					break

				case "download":
					switch (m2rArgs.payload.action) {
						case "new":
							dispatch({
								type: ActionsEnum.ADD_DOWNLOAD_CARD,
								payload: m2rArgs.payload.payload,
							})
							break

						case "update":
							dispatch({
								type: ActionsEnum.UPDATE_DOWNLOAD_CARD,
								payload: m2rArgs.payload.payload,
							})
							break
					}
					break
			}
		})
	}, [])

	return (
		<globalContext.Provider value={{ globalState, dispatch }}>
			{props.children}
		</globalContext.Provider>
	)
}
