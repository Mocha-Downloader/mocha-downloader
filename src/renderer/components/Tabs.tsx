import { useContext } from "react"
import { Container, Tab } from "semantic-ui-react"
import styled from "styled-components"

import { globalContext } from "../ipc"

import DownloadPane from "../TabPanes/DownloadPane"
import SettingsPane from "../TabPanes/SettingsPane"

export enum TabEnum {
	DOWNLOAD = 0,
	SETTINGS = 1,
}

const StyledTab = styled(Tab)`
	/* // todo: find a less hacky solution // */
	margin-top: 48px;
	margin-bottom: 47px;
	height: calc(100vh - 48px - 47px);

	overflow-y: scroll;

	.tabular {
		display: none;
	}
`

const StyledContainer = styled(Container)`
	display: flex;

	width: 100%;
	height: 100%;

	padding-top: 1rem;
`

export const StyledPaneContainer: React.FC = ({ children }) => {
	return (
		<StyledContainer>
			{children}
			<br />
			<br />
		</StyledContainer>
	)
}

const panes = [
	{ render: () => <DownloadPane /> },
	{ render: () => <SettingsPane /> },
]

const Tabs = () => {
	const { globalState } = useContext(globalContext)

	return <StyledTab panes={panes} activeIndex={globalState.tabIndex} />
}

export default Tabs
