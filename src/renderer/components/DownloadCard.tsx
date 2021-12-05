import { useContext, useEffect, useState } from "react"
import { Card, Image, Button, Progress, Icon } from "semantic-ui-react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

import platformIcons from "common/platformIcons"
import { IDownloadCardProps } from "common/constants"
import { ActionsEnum } from "common/ipcTypes"
import { globalContext } from "../ipc"

const StyledThumbnail = styled(Image)`
	/* max height */
	/* fixed aspect ratio */
`

const StyledError = styled.div`
	color: red;
`

const DownloadCard = (props: IDownloadCardProps) => {
	const {
		keyValue,

		platform,
		title,
		thumbnail,

		status,
		errorMessage,
		unit,
		totalAmount,
		amountComplete,
		isDownloadComplete,
	} = props

	const { dispatch } = useContext(globalContext)
	const [isDownloading, setIsDownloading] = useState(true)
	const [completePercentage, setCompletePercentage] = useState(0)

	const { t } = useTranslation()

	useEffect(() => {
		const percentageValue = 100 * (amountComplete / totalAmount)
		if (!isNaN(percentageValue)) setCompletePercentage(percentageValue)
	}, [amountComplete])

	return (
		<Card fluid>
			<Card.Content>
				{/* remove card button */}

				{isDownloadComplete && (
					<Button
						icon
						floated="right"
						style={{ backgroundColor: "transparent" }}
						onClick={() => {
							dispatch({
								type: ActionsEnum.REMOVE_DOWNLOAD_CARD,
								payload: keyValue,
							})
						}}
					>
						<Icon name="close" />
					</Button>
				)}

				{/* Top content */}

				<StyledThumbnail floated="left" size="tiny" src={thumbnail} />
				<Card.Header>{title}</Card.Header>
				<Card.Meta>
					<Image src={platformIcons[platform]} />
					<strong>{t(`platform.${platform}`)}</strong>
				</Card.Meta>

				{/* Bottom content */}

				<div style={{ marginTop: "2rem" }}>
					<div style={{ marginBottom: "-0.8rem" }}>
						{amountComplete} / {totalAmount} {unit}&nbsp;&nbsp;(
						<strong>{completePercentage.toFixed(1)}%</strong>)
					</div>
					<Progress
						percent={completePercentage}
						size="tiny"
						style={{ marginBottom: "0" }}
					/>
					{isDownloadComplete ? <strong>done!</strong> : status}
					{errorMessage && (
						<StyledError>ERROR: {errorMessage}</StyledError>
					)}
				</div>

				{/* Download control buttons */}

				<Button.Group floated="right" style={{ marginTop: "-1rem" }}>
					<Button
						icon
						onClick={() => {
							setIsDownloading((prev) => !prev)
						}}
					>
						<Icon name={isDownloading ? "pause" : "play"} />
					</Button>
					<Button icon>
						<Icon name="stop" />
					</Button>
				</Button.Group>
			</Card.Content>
		</Card>
	)
}

export default DownloadCard
