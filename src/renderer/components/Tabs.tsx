import { useContext } from "react"
import { Container, Tab } from "semantic-ui-react"
import styled from "styled-components"

import { globalContext } from "../ipc"

import DownloadPane from "../TabPanes/DownloadPane"
import SettingsPane from "../TabPanes/SettingsPane"
import HelpPane from "../TabPanes/HelpPane"

export enum TabEnum {
	DOWNLOAD = 0,
	SETTINGS = 1,
	HELP = 2,
}

export const StyledDownloadPaneContainer = styled(Container)`
	display: flex;
	width: 100%;
	height: 100%;

	padding-top: 4rem;
	padding-bottom: 8rem;
`

const StyledTab = styled(Tab)`
	height: 100%;

	.tabular {
		display: none;
	}

	.tab {
		height: 100%;
	}
`

const panes = [
	{
		render: () => (
			<Tab.Pane>
				<DownloadPane />
			</Tab.Pane>
		),
	},
	{
		render: () => (
			<Tab.Pane>
				<SettingsPane />
			</Tab.Pane>
		),
	},
	{
		render: () => (
			<Tab.Pane>
				<HelpPane />
			</Tab.Pane>
		),
	},
]

const Settings = () => {
	const { globalState } = useContext(globalContext)

	return <StyledTab panes={panes} activeIndex={globalState.tabIndex} />
}

export default Settings
