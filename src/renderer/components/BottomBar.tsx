import { Menu, Container, Icon, Progress } from "semantic-ui-react"
import styled from "styled-components"

const StyledBottomBarContainer = styled(Container)`
	display: flex;
	justify-content: space-between;
`

const StyledProgressContainer = styled(Menu.Item)`
	width: 100%;
	flex-direction: column;
	gap: 0.5rem;

	.progress {
		width: 100%;
	}
`

const StyledProgressDataContainer = styled.div`
	display: flex;
`

const BottomBar = () => {
	return (
		<Menu fixed="bottom" inverted>
			<StyledBottomBarContainer>
				<StyledProgressContainer>
					<StyledProgressDataContainer>
						Downloading: ASDF
					</StyledProgressDataContainer>
					<Progress percent={100} size="tiny" />
				</StyledProgressContainer>

				<Menu.Item>
					<a
						href="https://github.com/Mocha-Downloader/mocha-downloader"
						target="_"
					>
						<Icon link size="big" name="github square" />
					</a>
					<a href="https://discord.gg/aQqamSCUcS" target="_">
						<Icon link size="big" name="discord" />
					</a>
				</Menu.Item>
			</StyledBottomBarContainer>
		</Menu>
	)
}

export default BottomBar
