import { useEffect, useState } from "react"
import { Card, Image, Button, Progress, Icon } from "semantic-ui-react"

const DownloadElement = (props: { totalAmount: number; unit: string }) => {
	const { totalAmount, unit } = props

	const [isDownloading, setIsDownloading] = useState(true)
	const [amountComplete, setAmountComplete] = useState(69)
	const [completePercentage, setCompletePercentage] = useState(0)

	useEffect(() => {
		setCompletePercentage(100 * (amountComplete / totalAmount))
	}, [amountComplete])

	return (
		<Card fluid>
			<Card.Content>
				<Image
					floated="left"
					size="small"
					src="https://react.semantic-ui.com/images/wireframe/square-image.png"
				/>

				<Card.Header>Content title</Card.Header>

				<Card.Meta>
					<Icon color="red" name="youtube" />
					<strong>YouTube</strong> <strong>mp4</strong>
				</Card.Meta>

				<Card.Description>
					<div
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
						percent={100}
						size="tiny"
						style={{ marginBottom: "0rem" }}
					/>
				</Card.Description>
			</Card.Content>
		</Card>
	)
}

export default DownloadElement
