// todo: think of a better name
import { Button, Grid, Icon, Item, Progress } from "semantic-ui-react"
import styled from "styled-components"

import icon from "../../../assets/icon.png"

const StyledGrid = styled(Grid)`
	width: 100%;
	height: 100%;

	/* progress bar */
	.progress {
		width: 100%;
	}
`

const StyledExtraTop = styled(Grid.Row)`
	display: flex;
	justify-content: space-between;
	align-items: center !important;
`

const StyledExtraTopInfoContainer = styled.div`
	display: flex;
	align-items: center;
	gap: 1rem;
`

const DownloadElement = () => {
	return (
		<Item>
			<Item.Image size="tiny" src={icon} />

			<Item.Content>
				<Item.Header>Title</Item.Header>

				<Item.Meta>
					<Icon color="red" name="youtube" /> YouTube
				</Item.Meta>

				<Item.Description>What do I put here</Item.Description>

				<Item.Extra>
					<StyledGrid>
						<StyledExtraTop>
							<div>mp4</div>
							<StyledExtraTopInfoContainer>
								<div>69MB / 420MB (6.9MBps)</div>
								<Button>Pause</Button>
							</StyledExtraTopInfoContainer>
						</StyledExtraTop>

						<Grid.Row>
							<Progress percent={100} size="tiny" />
						</Grid.Row>
					</StyledGrid>
				</Item.Extra>
			</Item.Content>
		</Item>
	)
}

export default DownloadElement
