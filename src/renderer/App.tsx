import { useEffect, useState } from "react"
import { Container, Card, Header } from "semantic-ui-react"
import styled from "styled-components"

import { SelectOptions } from "./components/SelectOptions"
import AnimatedLogo from "./components/AnimatedLogo"
import BottomBar from "./components/BottomBar"
import DownloadElement from "./components/DownloadElement"
import TopBar from "./components/TopBar"

import { GlobalStore } from "./ipc"

import GlobalStyle from "./globalStyle"
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

const App = () => {
	const [isDownloadListEmpty, setDownloadListEmpty] = useState(true)

	useEffect(() => {
		setDownloadListEmpty(true) // prevent build error. Will be removed later when a proper logic is implemented.
	}, [])

	return (
		<GlobalStore>
			<GlobalStyle />
			<TopBar />
			<StyledDownloadListContainer>
				<Card.Group divided>
					{/* where the downloading contents will be listed */}
					{!isDownloadListEmpty && (
						<>
							<DownloadElement
								title="Awesome title"
								thumbnail="https://react.semantic-ui.com/images/wireframe/square-image.png"
								totalAmount={420}
								unit="MB"
							/>
							<DownloadElement
								title="Awesome title"
								thumbnail="https://react.semantic-ui.com/images/wireframe/square-image.png"
								totalAmount={420}
								unit="MB"
							/>
						</>
					)}
				</Card.Group>

				<br />

				{isDownloadListEmpty ? (
					<StyledInstructions>
						<Header size="huge" icon>
							{/* https://en.wikipedia.org/wiki/Caffeine */}
							<AnimatedLogo size={100} />
							Paste link to start downloading
							<Header.Subheader>
								Press F1 to learn more
							</Header.Subheader>
						</Header>
					</StyledInstructions>
				) : (
					<AnimatedLogo size={50} />
				)}

				<SelectOptions />
			</StyledDownloadListContainer>
			<BottomBar />
		</GlobalStore>
	)
}

export default App
