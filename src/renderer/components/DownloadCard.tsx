import { useContext, useEffect, useState } from "react"
import {
	Card,
	Image,
	Button,
	Progress,
	Icon,
	Modal,
	Header,
} from "semantic-ui-react"
import styled from "styled-components"
import { useTranslation } from "react-i18next"

import platformIcons from "../../common/platformIcons"
import { IDownloadCardProps } from "../../common/constants"
import { ActionsEnum } from "../../common/ipcTypes"
import { globalContext } from "../ipc"

const StyledThumbnail = styled(Image)`
	/* // todo: max height // */
	/* // todo: fixed aspect ratio // */
`

const StyledError = styled.div`
	color: red;
`

const DownloadCard = (props: IDownloadCardProps) => {
	const {
		downloadCardID,

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
	const [isRemoveConfirmModalVisible, setRemoveConfirmModalVisibility] =
		useState(false)
	const [isDownloading, setIsDownloading] = useState(true)
	const [completePercentage, setCompletePercentage] = useState(0)

	const { t } = useTranslation()

	useEffect(() => {
		const percentageValue = 100 * (amountComplete / totalAmount)
		if (!isNaN(percentageValue)) setCompletePercentage(percentageValue)
	}, [amountComplete])

	const handleRemoveCardButtonClicked = () => {
		setRemoveConfirmModalVisibility(true)
	}

	const handlePauseResumeButtonClicked = () => {
		window.electron.ipcRenderer.send({
			type: "downloadControl",
			payload: {
				type: isDownloading ? "pause" : "resume",
				downloadCardID: downloadCardID,
			},
		})
		setIsDownloading((prev) => !prev)
	}

	const handleStopButtonClicked = () => {
		window.electron.ipcRenderer.send({
			type: "downloadControl",
			payload: {
				type: "stop",
				downloadCardID: downloadCardID,
			},
		})
	}

	return (
		<Card fluid>
			{/* Card remove confirm */}
			<Modal
				basic
				size="small"
				open={isRemoveConfirmModalVisible}
				onOpen={() => {
					setRemoveConfirmModalVisibility(true)
				}}
				onClose={() => {
					setRemoveConfirmModalVisibility(false)
				}}
			>
				<Header icon>
					<Icon name="trash alternate outline" />
					Delete card?
				</Header>
				<Modal.Actions
					style={{ display: "flex", justifyContent: "center" }}
				>
					<Button
						basic
						color="red"
						inverted
						onClick={() => setRemoveConfirmModalVisibility(false)}
					>
						<Icon name="x" /> No
					</Button>
					<Button
						color="green"
						inverted
						onClick={() => {
							setRemoveConfirmModalVisibility(false)

							dispatch({
								type: ActionsEnum.REMOVE_DOWNLOAD_CARD,
								payload: downloadCardID,
							})
						}}
					>
						<Icon name="check" /> Yes
					</Button>
				</Modal.Actions>
			</Modal>

			<Card.Content>
				{/* remove card button */}

				{isDownloadComplete && (
					<Button
						icon
						floated="right"
						style={{ backgroundColor: "transparent" }}
						onClick={handleRemoveCardButtonClicked}
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

				{/* // todo: wait for 500ms for further input in case the user clicks the button multiple times // */}
				<Button.Group floated="right" style={{ marginTop: "-1rem" }}>
					<Button icon onClick={handlePauseResumeButtonClicked}>
						<Icon name={isDownloading ? "pause" : "play"} />
					</Button>
					<Button icon onClick={handleStopButtonClicked}>
						<Icon name="stop" />
					</Button>
				</Button.Group>
			</Card.Content>
		</Card>
	)
}

export default DownloadCard
