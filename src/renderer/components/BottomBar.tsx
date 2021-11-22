import { Menu, Container, Icon } from "semantic-ui-react"
import ReactTooltip from "react-tooltip"

const BottomBar = () => {
	return (
		<Menu fixed="bottom" inverted>
			<Container>
				<Menu.Item data-tip="Settings">
					<Icon link size="large" name="settings" />
					<ReactTooltip effect="solid" />
				</Menu.Item>
				<Menu.Item data-tip="Help">
					<Icon link size="large" name="question circle" />
					<ReactTooltip effect="solid" />
				</Menu.Item>

				{/* Separate links that opens a new tab in the browser */}
				<Menu.Menu position="right">
					<a
						href="https://mocha-downloader.github.io"
						target="_"
						data-tip="Documentation"
					>
						<Menu.Item>
							<Icon link size="large" name="book" />
							<ReactTooltip effect="solid" />
						</Menu.Item>
					</a>

					<a
						href="https://discord.gg/aQqamSCUcS"
						target="_"
						data-tip="Discord"
					>
						<Menu.Item>
							<Icon link size="large" name="discord" />
							<ReactTooltip effect="solid" />
						</Menu.Item>
					</a>

					<a
						href="https://github.com/Mocha-Downloader/mocha-downloader"
						target="_"
						data-tip="Source Code"
					>
						<Menu.Item>
							<Icon link size="large" name="github square" />
							<ReactTooltip effect="solid" />
						</Menu.Item>
					</a>
				</Menu.Menu>
			</Container>
		</Menu>
	)
}

export default BottomBar
