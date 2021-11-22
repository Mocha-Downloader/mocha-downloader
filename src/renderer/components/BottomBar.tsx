import { Menu, Container, Icon, Progress } from "semantic-ui-react"
import styled from "styled-components"
import ReactTooltip from "react-tooltip"

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
						href="https://mocha-downloader.github.io"
						target="_"
						data-tip="Documentation"
					>
						<Icon link size="large" name="book" />
						<ReactTooltip effect="solid" />
					</a>

					<a
						href="https://discord.gg/aQqamSCUcS"
						target="_"
						data-tip="Discord"
					>
						<Icon link size="large" name="discord" />
						<ReactTooltip effect="solid" />
					</a>

					<a
						href="https://github.com/Mocha-Downloader/mocha-downloader"
						target="_"
						data-tip="Source Code"
					>
						<Icon link size="large" name="github square" />
						<ReactTooltip effect="solid" />
					</a>
				</Menu.Item>
			</StyledBottomBarContainer>
		</Menu>
	)
}

export default BottomBar
