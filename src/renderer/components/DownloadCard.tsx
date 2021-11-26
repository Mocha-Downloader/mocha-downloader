import { useContext, useEffect, useState } from "react"
import { Card, Image, Button, Progress, Icon } from "semantic-ui-react"

import { platformID, platformID2NameMap } from "../constants"
import { globalContext, ActionsEnum } from "../ipc"

import platformImage from "../../../assets/platforms/comic.naver.com.png"

export interface IDownloadCardProps {
	keyValue: string // key value that can be access programmatically

	platform: platformID
	title: string
	thumbnail: string | Buffer

	totalAmount: number
	unit: string
}

const DownloadCard = (props: IDownloadCardProps) => {
	const { keyValue, platform, title, thumbnail, totalAmount, unit } = props

	const { dispatch } = useContext(globalContext)
	const [isDownloading, setIsDownloading] = useState(true)
	const [amountComplete, setAmountComplete] = useState(0)
	const [completePercentage, setCompletePercentage] = useState(0)

	useEffect(() => {
		setCompletePercentage(100 * (amountComplete / totalAmount))
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

				{/* todo: find a more non-hacky way to put download related stuff on the bottom*/}
				<div style={{ marginTop: "3.05rem" }}>
					<div
						style={{ paddingTop: "0.8rem", marginBottom: "-1rem" }}
						onClick={() => {
							setAmountComplete((prev) => prev + 5)
						}}
					>
						<strong>{completePercentage.toFixed(1)}%</strong>
						&nbsp;&nbsp;&nbsp;
						{amountComplete} / {totalAmount} {unit}
					</div>

					<Button.Group
						floated="right"
						style={{ marginTop: "-2rem" }}
					>
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

					<br />

					<Progress
						percent={completePercentage}
						size="tiny"
						style={{ marginBottom: "0rem" }}
					/>
				</div>
			</Card.Content>
		</Card>
	)
}

export default DownloadCard
