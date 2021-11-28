/**
 *  Handles global state and electron ipc.
 */

import {
	createContext,
	Dispatch,
	ReactElement,
	ReactNode,
	useEffect,
	useReducer,
} from "react"
import { Optional, Required } from "utility-types"

import { IDownloadCardProps } from "common/constants"

interface Dict<T> {
	[key: string]: T
}

interface ISelectOptionsEntry {
	title: string
	url: string
}

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
}

type IGlobalAction =
	| {
			type: ActionsEnum.SHOW_ABOUT_MODAL
	  }
	| {
			type: ActionsEnum.HIDE_ABOUT_MODAL
	  }
	| {
			type: ActionsEnum.SHOW_SELECT_OPTIONS
			payload: {
				url: string
				availableChoices: ISelectOptionsEntry[]
			}
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
			payload: {
				index: number
				isSelected: boolean
			}
	  }
	| {
			type: ActionsEnum.ADD_DOWNLOAD_CARD
			payload: {
				key: string
				data: Required<Optional<IDownloadCardProps>, "platform">
			}
	  }
	| {
			type: ActionsEnum.UPDATE_DOWNLOAD_CARD
			payload: {
				cardID: string
				key: string
				value: any
			}
	  }
	| {
			type: ActionsEnum.REMOVE_DOWNLOAD_CARD
			payload: string
	  }

interface IGlobalState {
	aboutModalVisibility: boolean
	downloadCards: Dict<IDownloadCardProps>
	selectOptions: {
		isVisible: boolean
		url: string
		availableChoices: ISelectOptionsEntry[]
		selectedChoices: boolean[]
	}
}

interface IContext {
	globalState: IGlobalState
	dispatch: Dispatch<IGlobalAction>
}

const defaultState: IGlobalState = {
	aboutModalVisibility: false,
	downloadCards: {},
	selectOptions: {
		isVisible: false,
		url: "",
		availableChoices: [],
		selectedChoices: [],
	},
}

const reducer = (state = defaultState, action: IGlobalAction): IGlobalState => {
	switch (action.type) {
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

			downloadCards[action.payload.key] = {
				title: "",
				thumbnail:
					"https://react.semantic-ui.com/images/wireframe/image.png", // placeholder image

				status: "initializing",
				totalAmount: 0,
				amountComplete: 0,

				isDownloadComplete: false,

				// convert to any to prevent error ts(2783)
				...(action.payload.data as any),
			}

			return {
				...state,
				downloadCards: downloadCards,
			}
		}
		case ActionsEnum.UPDATE_DOWNLOAD_CARD: {
			const DownloadCards = state.downloadCards

			if (
				DownloadCards[action.payload.cardID].hasOwnProperty(
					action.payload.key
				)
			)
				// @ts-ignore
				DownloadCards[action.payload.cardID][action.payload.key] =
					action.payload.value

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
				downloadCards: downloadCards,
			}
		}

		default:
			return state
	}
}

export const globalContext = createContext({} as IContext)

export const GlobalStore = (props: { children: ReactNode }): ReactElement => {
	const [globalState, dispatch] = useReducer(reducer, defaultState)

	const showSelectOptions = async (
		url: string,
		availableChoices: ISelectOptionsEntry[]
	) => {
		// select all choices
		dispatch({
			type: ActionsEnum.SET_SELECT_OPTIONS,
			payload: Array(availableChoices.length).fill(true),
		})

		dispatch({
			type: ActionsEnum.SHOW_SELECT_OPTIONS,
			payload: { url, availableChoices },
		})
	}

	// register listener only once
	useEffect(() => {
		window.electron.ipcRenderer.on((...args) => {
			if (window.electron.isDev) console.log("m2r:", args)

			switch (args[0]) {
				case "showAbout":
					dispatch({ type: ActionsEnum.SHOW_ABOUT_MODAL })
					break

				case "select":
					// args1: string
					// args2: ISelectOptionsEntry[]

					showSelectOptions(args[1], args[2])
					break

				case "download":
					switch (args[1]) {
						case "new":
							dispatch({
								type: ActionsEnum.ADD_DOWNLOAD_CARD,
								payload: { key: args[2], data: args[3] },
							})
							break

						case "update":
							dispatch({
								type: ActionsEnum.UPDATE_DOWNLOAD_CARD,
								payload: {
									cardID: args[2],
									key: args[3],
									value: args[4],
								},
							})
							break
					}
			}
		})
	}, [])

	return (
		<globalContext.Provider value={{ globalState, dispatch }}>
			{props.children}
		</globalContext.Provider>
	)
}
