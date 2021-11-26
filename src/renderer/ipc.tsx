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

import { IDownloadCardProps } from "./components/DownloadCard"

export enum ActionsEnum {
	SHOW_SELECT_OPTIONS = "SHOW_SELECT_OPTIONS",
	HIDE_SELECT_OPTIONS = "HIDE_SELECT_OPTIONS",
	SET_SELECT_OPTIONS = "SET_SELECT_OPTIONS",
	UPDATE_SELECT_OPTIONS = "UPDATE_SELECT_OPTIONS",

	ADD_DOWNLOAD_CARDS = "ADD_DOWNLOAD_CARDS",
	UPDATE_DOWNLOAD_CARD = "UPDATE_DOWNLOAD_CARD",
	REMOVE_DOWNLOAD_CARDS = "REMOVE_DOWNLOAD_CARDS",
}

interface Dict<T> {
	[key: string]: T
}

interface ISelectOptionsEntry {
	title: string
	url: string
}

interface IGlobalState {
	downloadCards: Dict<IDownloadCardProps>
	selectOptions: {
		isVisible: boolean
		url: string
		availableChoices: ISelectOptionsEntry[]
		selectedChoices: boolean[]
	}
}

interface IGlobalAction {
	type: ActionsEnum
	payload?: any
}

interface IContext {
	globalState: IGlobalState
	dispatch: Dispatch<IGlobalAction>
}

const defaultState: IGlobalState = {
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
		// SelectOptions related

		case ActionsEnum.SHOW_SELECT_OPTIONS:
			const payload: {
				url: string
				availableChoices: ISelectOptionsEntry[]
			} = action.payload

			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					isVisible: true,
					url: payload.url || state.selectOptions.url,
					availableChoices:
						payload.availableChoices ||
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
			const payload: boolean[] = action.payload

			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					selectedChoices: payload || [],
				},
			}
		}
		case ActionsEnum.UPDATE_SELECT_OPTIONS: {
			const payload: { index: number; isSelected: boolean } =
				action.payload

			const selectedChoices = state.selectOptions.selectedChoices
			selectedChoices[payload.index] = payload.isSelected

			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					selectedChoices: selectedChoices,
				},
			}
		}

		// downloadCard related
		// brackets are added to create a new lexical scope and prevent variable name collision

		case ActionsEnum.ADD_DOWNLOAD_CARDS: {
			const payload: Dict<IDownloadCardProps> = action.payload

			const downloadCards = state.downloadCards

			for (const [key, value] of Object.entries(
				payload as Dict<IDownloadCardProps>
			)) {
				downloadCards[key] = value
			}

			return {
				...state,
				downloadCards: downloadCards,
			}
		}
		case ActionsEnum.UPDATE_DOWNLOAD_CARD: {
			const payload: { cardID: string; key: string; value: any } =
				action.payload

			const DownloadCards = state.downloadCards

			if (DownloadCards[payload.cardID].hasOwnProperty(payload.key))
				// @ts-ignore
				DownloadCards[payload.cardID][payload.key] = payload.value

			return {
				...state,
				downloadCards: DownloadCards,
			}
		}

		case ActionsEnum.REMOVE_DOWNLOAD_CARDS: {
			const payload: string[] = action.payload

			const downloadCards = state.downloadCards

			;(payload as string[]).map((key) => {
				delete downloadCards[key]
			})

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
				case "select":
					// args1: string
					// args2: ISelectOptionsEntry[]

					showSelectOptions(args[1], args[2])
					break

				case "download":
					switch (args[1]) {
						case "new":
							// args1: Dict<IDownloadCardProps>

							dispatch({
								type: ActionsEnum.ADD_DOWNLOAD_CARDS,
								payload: args[2],
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
