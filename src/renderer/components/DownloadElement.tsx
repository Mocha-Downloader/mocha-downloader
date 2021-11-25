import { useEffect, useState } from "react"
import { Card, Image, Button, Progress, Icon } from "semantic-ui-react"

interface IDownloadElementProps {
	title: string
	thumbnail: string | Buffer

	totalAmount: number
	unit: string
}

const DownloadElement = (props: IDownloadElementProps) => {
	const { title, thumbnail, totalAmount, unit } = props

	const [isDownloading, setIsDownloading] = useState(true)
	const [amountComplete, setAmountComplete] = useState(69)
	const [completePercentage, setCompletePercentage] = useState(0)

	useEffect(() => {
		setCompletePercentage(100 * (amountComplete / totalAmount))
	}, [amountComplete])

	return (
		<Card fluid>
			<Card.Content>
				<Image floated="left" size="tiny" src={thumbnail} />

				<Card.Header>{title}</Card.Header>

				<Card.Meta>
					<Icon color="red" name="youtube" />
					<strong>YouTube</strong> <strong>mp4</strong>
				</Card.Meta>

				{/* todo: find a more non-hacky way to put download related stuff on the bottom*/}
				<div style={{ marginTop: "3.05rem" }}>
					<div
						style={{ paddingTop: "0.8rem", marginBottom: "-1rem" }}
						onClick={() => {
							setAmountComplete((prev) => prev + 5)
						}}
					>
						{amountComplete}
						{unit} / {totalAmount}
						{unit} <strong>{completePercentage.toFixed(1)}%</strong>
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

export default DownloadElement
