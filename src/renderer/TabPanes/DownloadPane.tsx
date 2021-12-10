import { useContext, useEffect, useState } from "react"
import { Card, Header } from "semantic-ui-react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import { globalContext } from "../ipc"

import { StyledPaneContainer } from "../components/Tabs"
import DebuggingInput from "../components/DebuggingInput"
import DownloadCard from "../components/DownloadCard"
import AnimatedLogo from "../components/AnimatedLogo"
import Dropzone from "../components/DropZone"

const StyledInstructions = styled.div`
	display: flex;
	justify-content: center;
	user-select: none;
`

const DownloadPane = () => {
	const { globalState } = useContext(globalContext)
	const [downloadCardsCount, setDownloadCardsCount] = useState(0)
	const { t } = useTranslation()

	useEffect(() => {
		setDownloadCardsCount(Object.keys(globalState.downloadCards).length)
	}, [globalState])

	return (
		<StyledPaneContainer>
			{window.electron.isDev && (
				<>
					<DebuggingInput />
					<br />
					<br />
				</>
			)}

			<Card.Group>
				{Object.entries(globalState.downloadCards).map(
					([key, downloadCardProps]) => {
						return <DownloadCard key={key} {...downloadCardProps} />
					}
				)}
			</Card.Group>

			<br />

			{downloadCardsCount <= 0 ? (
				<StyledInstructions>
					<Header size="huge" icon>
						{/* https://en.wikipedia.org/wiki/Caffeine */}
						<AnimatedLogo size={100} />
						{t("instructions.header")}
						<Header.Subheader>
							{t("instructions.subheader")}
						</Header.Subheader>
					</Header>
				</StyledInstructions>
			) : (
				<AnimatedLogo size={50} />
			)}

			<br />

			<Dropzone />
		</StyledPaneContainer>
	)
}

export default DownloadPane
