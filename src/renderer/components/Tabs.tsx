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
`

const StyledTab = styled(Tab)`
	display: flex;
	padding-top: 5rem;

	.tabular {
		display: none;
	}
`

const panes = [
	{ render: () => <DownloadPane /> },
	{ render: () => <SettingsPane /> },
	{ render: () => <HelpPane /> },
]

const Tabs = () => {
	const { globalState } = useContext(globalContext)

	return <StyledTab panes={panes} activeIndex={globalState.tabIndex} />
}

export default Tabs
