import { useContext, useEffect, useState } from "react"
import { Container, Card, Header } from "semantic-ui-react"
import styled from "styled-components"

import { SelectOptions } from "./components/SelectOptions"
import AnimatedLogo from "./components/AnimatedLogo"
import BottomBar from "./components/BottomBar"
import DownloadElement from "./components/DownloadElement"
import TopBar from "./components/TopBar"

import { globalContext } from "./ipc"

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
	const { globalState } = useContext(globalContext)
	const [isDownloadListEmpty, setDownloadListEmpty] = useState(true)

	useEffect(() => {
		setDownloadListEmpty(
			Object.keys(globalState.downloadElements).length == 0
		)
	}, [globalState])

	return (
		<>
			<GlobalStyle />
			<TopBar />
			<StyledDownloadListContainer>
				<Card.Group>
					{Object.entries(globalState.downloadElements).map(
						([key, { title, thumbnail, totalAmount, unit }]) => {
							return (
								<DownloadElement
									key={key}
									keyValue={key}
									title={title}
									thumbnail={thumbnail}
									totalAmount={totalAmount}
									unit={unit}
								/>
							)
						}
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
		</>
	)
}

export default App
