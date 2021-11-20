import { Container, Item, Header } from "semantic-ui-react"
import { render } from "react-dom"
import styled from "styled-components"

import GlobalStyle from "./globalStyle"

import AnimatedLogo from "./components/AnimatedLogo"
import TopBar from "./components/TopBar"
import BottomBar from "./components/BottomBar"
import { SelectOptions } from "./components/SelectOptions"

import { GlobalStore } from "./ipc"

import "semantic-ui-css/semantic.min.css"

const StyledDownloadListContainer = styled(Container)`
	display: flex;

	padding-top: 5rem;
	padding-bottom: 8rem;
`

const StyledInstructions = styled.div`
	display: flex;
	justify-content: center;
	user-select: none;

	width: 100%;
	height: 100%;
`

render(
	<GlobalStore>
		<GlobalStyle />
		<TopBar />
		<StyledDownloadListContainer text>
			<Item.Group divided>
				{/* where the downloading contents will be listed */}
			</Item.Group>

			<StyledInstructions>
				<Header as="h2" icon>
					{/* https://en.wikipedia.org/wiki/Caffeine */}
					<AnimatedLogo size={100} />
					Paste link to start downloading
					<Header.Subheader>Press F1 to learn more</Header.Subheader>
				</Header>
			</StyledInstructions>

			<SelectOptions />
		</StyledDownloadListContainer>
		<BottomBar />
	</GlobalStore>,
	document.getElementById("root")
)
