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
			// action.payload: { url: string, availableChoices: ISelectOptionsEntry[] }

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
		case ActionsEnum.HIDE_SELECT_OPTIONS:
			// action.payload: none

			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					isVisible: false,
				},
			}
		case ActionsEnum.SET_SELECT_OPTIONS:
			// action.payload: boolean[]

			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					selectedChoices: action.payload || [],
				},
			}
		case ActionsEnum.UPDATE_SELECT_OPTIONS:
			// action.payload: { index: number, isSelected: boolean }

			const selectedChoices = state.selectOptions.selectedChoices
			selectedChoices[action.payload.index] = action.payload.isSelected

			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					selectedChoices: selectedChoices,
				},
			}

		// downloadCard related
		// brackets are added to create a new lexical scope and prevent variable name collision

		case ActionsEnum.ADD_DOWNLOAD_CARDS: {
			// action.payload: Dict<IDownloadCardProps>

			const downloadCards = state.downloadCards

			for (const [key, value] of Object.entries(
				action.payload as Dict<IDownloadCardProps>
			)) {
				downloadCards[key] = value
			}

			return {
				...state,
				downloadCards: downloadCards,
			}
		}

		case ActionsEnum.REMOVE_DOWNLOAD_CARDS: {
			// action.payload: string[]

			const downloadCards = state.downloadCards

			;(action.payload as string[]).map((key) => {
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
					// args1: Dict<IDownloadCardProps>

					dispatch({
						type: ActionsEnum.ADD_DOWNLOAD_CARDS,
						payload: args[1],
					})
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
