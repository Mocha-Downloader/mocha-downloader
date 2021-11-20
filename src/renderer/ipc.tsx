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
}

interface IGlobalState {
	openSelectOptions: boolean
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
	openSelectOptions: false,
}

function reducer(state = defaultState, action: IGlobalAction) {
	switch (action.type) {
		case ActionsEnum.SHOW_SELECT_OPTIONS:
			return { ...state, openSelectOptions: true }

		case ActionsEnum.HIDE_SELECT_OPTIONS:
			return { ...state, openSelectOptions: false }

		default:
			return state
	}
}

export const globalContext = createContext({} as IContext)

export const GlobalStore = (props: { children: ReactNode }): ReactElement => {
	const [globalState, dispatch] = useReducer(reducer, defaultState)

	const showSelectOptions = async (
		url: string,
		choices: { title: string; url: string }
	) => {
		dispatch({
			type: ActionsEnum.SHOW_SELECT_OPTIONS,
			payload: { url, choices },
		})
	}

	// register listener only once
	useEffect(() => {
		window.electron.ipcRenderer.on((...args) => {
			if (window.electron.isDev) console.log("m2r:", args)

			if (args[0] === "select") showSelectOptions(args[1], args[2])
		})
	}, [])

	return (
		<globalContext.Provider value={{ globalState, dispatch }}>
			{props.children}
		</globalContext.Provider>
	)
}
