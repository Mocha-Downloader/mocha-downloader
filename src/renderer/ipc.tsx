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

export enum ActionsEnum {
	SHOW_SELECT_OPTIONS = "SHOW_SELECT_OPTIONS",
	HIDE_SELECT_OPTIONS = "HIDE_SELECT_OPTIONS",
	SET_SELECT_OPTIONS = "SET_SELECT_OPTIONS",
	UPDATE_SELECT_OPTIONS = "UPDATE_SELECT_OPTIONS",
}

interface ISelectOptionsEntry {
	title: string
	url: string
}

interface IGlobalState {
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
	selectOptions: {
		isVisible: false,
		url: "",
		availableChoices: [],
		selectedChoices: [],
	},
}

function reducer(state = defaultState, action: IGlobalAction): IGlobalState {
	switch (action.type) {
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
		case ActionsEnum.HIDE_SELECT_OPTIONS:
			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					isVisible: false,
				},
			}
		case ActionsEnum.SET_SELECT_OPTIONS:
			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					selectedChoices: action.payload || [],
				},
			}
		case ActionsEnum.UPDATE_SELECT_OPTIONS:
			const selectedChoices = state.selectOptions.selectedChoices
			selectedChoices[action.payload.index] = action.payload.value

			return {
				...state,
				selectOptions: {
					...state.selectOptions,

					selectedChoices: selectedChoices,
				},
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
					showSelectOptions(args[1], args[2])
					break

				case "download":
					console.log("adding DownloadElement")
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
