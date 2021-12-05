import { useContext, useEffect, useState } from "react"
import { Card, Header } from "semantic-ui-react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

import { globalContext } from "../ipc"

import AnimatedLogo from "../components/AnimatedLogo"
import DownloadCard from "../components/DownloadCard"
import { StyledDownloadPaneContainer } from "../components/Tabs"

const StyledInstructions = styled.div`
	display: flex;
	justify-content: center;
	user-select: none;

	width: 100%;
	height: 100%;
`

const DownloadPane = () => {
	const { globalState } = useContext(globalContext)
	const [isDownloadListEmpty, setDownloadListEmpty] = useState(true)
	const { t } = useTranslation()

	useEffect(() => {
		setDownloadListEmpty(Object.keys(globalState.downloadCards).length == 0)
	}, [globalState])

	return (
		<StyledDownloadPaneContainer>
			<Card.Group>
				{Object.entries(globalState.downloadCards).map(
					([key, downloadCardProps]) => {
						return <DownloadCard key={key} {...downloadCardProps} />
					}
				)}
			</Card.Group>

			<br />

			{isDownloadListEmpty ? (
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
		</StyledDownloadPaneContainer>
	)
}

export default DownloadPane
