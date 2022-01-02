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
	Dict,
	IDownloadCardProps,
	ISelectOption,
	Locale,
	Settings,
} from "../common/constants"
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
	settings: {
		locale: "en",
	},
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
		// about settings
		case ActionsEnum.UPDATE_SETTINGS:
			changeLanguage(action.payload.locale)
			return {
				...state,
				settings: action.payload,
			}

		// about modal related
		case ActionsEnum.SHOW_ABOUT_MODAL:
			return {
				...state,
				aboutModalVisibility: true,
			}

		case ActionsEnum.HIDE_ABOUT_MODAL:
			return {
				...state,
				aboutModalVisibility: false,
			}

		// SelectOptions related

		case ActionsEnum.SHOW_SELECT_OPTIONS:
			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					isVisible: true,
					url: action.payload.url || state.selectOptions.url,
					availableChoices:
						action.payload.availableChoices ||
						state.selectOptions.availableChoices,
				},
			}
		case ActionsEnum.HIDE_SELECT_OPTIONS: {
			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					isVisible: false,
				},
			}
		}
		case ActionsEnum.SET_SELECT_OPTIONS: {
			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					selectedChoices: action.payload || [],
				},
			}
		}
		case ActionsEnum.UPDATE_SELECT_OPTIONS: {
			const selectedChoices = state.selectOptions.selectedChoices
			selectedChoices[action.payload.index] = action.payload.isSelected

			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					selectedChoices: selectedChoices,
				},
			}
		}

		// downloadCard related

		case ActionsEnum.ADD_DOWNLOAD_CARD: {
			const downloadCards = state.downloadCards

			// default values
			downloadCards[action.payload.downloadCardID] = {
				downloadCardID: action.payload.downloadCardID,

				title: "",
				thumbnail:
					"https://react.semantic-ui.com/images/wireframe/image.png", // placeholder image

				status: "initializing",
				unit: "",
				totalAmount: 0,
				amountComplete: 0,

				isDownloadComplete: false,

				// convert to any to prevent error ts(2783)
				...(action.payload.data as any),
			}

			return {
				...state,
				downloadCards,
			}
		}
		case ActionsEnum.UPDATE_DOWNLOAD_CARD: {
			const DownloadCards = state.downloadCards

			if (
				DownloadCards[action.payload.downloadCardID].hasOwnProperty(
					action.payload.key
				)
			)
				// @ts-ignore
				DownloadCards[action.payload.downloadCardID][
					action.payload.key
				] = action.payload.value

			return {
				...state,
				downloadCards: DownloadCards,
			}
		}
		case ActionsEnum.REMOVE_DOWNLOAD_CARD: {
			const downloadCards = state.downloadCards

			delete downloadCards[action.payload]

			return {
				...state,
				downloadCards,
			}
		}

		// tabs related

		case ActionsEnum.SET_TAB_INDEX: {
			return {
				...state,
				tabIndex: action.payload,
			}
		}

		default:
			return state
	}
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
