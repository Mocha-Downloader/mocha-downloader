import { useContext, useEffect, useState } from "react"
import { Card, Image, Button, Progress, Icon } from "semantic-ui-react"

import { platformID, platformID2NameMap } from "../constants"
import { globalContext, ActionsEnum } from "../ipc"

import platformImage from "../../../assets/platforms/comic.naver.com.png"

export interface IDownloadCardProps {
	keyValue: string // key value that can be access programmatically

	platform: platformID // the source of the downlaoding content
	title: string
	thumbnail: string | Buffer

	status: string // what the downloader currently doing
	totalAmount: number
	amountComplete: number
	isDownloadComplete: boolean // is everything completely done
}

const DownloadCard = (props: IDownloadCardProps) => {
	const {
		keyValue,

		platform,
		title,
		thumbnail,

		status,
		totalAmount,
		amountComplete,
		isDownloadComplete,
	} = props

	const { dispatch } = useContext(globalContext)
	const [isDownloading, setIsDownloading] = useState(true)
	const [completePercentage, setCompletePercentage] = useState(0)

	useEffect(() => {
		const percentageValue = 100 * (amountComplete / totalAmount)
		if (!isNaN(percentageValue)) setCompletePercentage(percentageValue)
	}, [amountComplete])

	return (
		<Card fluid>
			<Card.Content>
				<Button
					icon
					floated="right"
					style={{ backgroundColor: "transparent" }}
					onClick={() => {
						dispatch({
							type: ActionsEnum.REMOVE_DOWNLOAD_CARDS,
							payload: [keyValue],
						})
					}}
				>
					<Icon name="close" />
				</Button>
				<Image floated="left" size="tiny" src={thumbnail} />
				<Card.Header>{title}</Card.Header>
				<Card.Meta>
					<Image src={platformImage} />
					<strong>{platformID2NameMap[platform]}</strong>
				</Card.Meta>

				<div style={{ paddingTop: "1.3rem", marginBottom: "-0.8rem" }}>
					{amountComplete} / {totalAmount}&nbsp;&nbsp;(
					<strong>{completePercentage.toFixed(1)}%</strong>)
				</div>
				<Progress
					percent={completePercentage}
					size="tiny"
					style={{ marginBottom: "0" }}
				/>
				{isDownloadComplete ? <strong>done!</strong> : status}
				<Button.Group floated="right" style={{ marginTop: "0.5rem" }}>
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
