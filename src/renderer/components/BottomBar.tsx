import { Menu, Container, Icon, Popup } from "semantic-ui-react"

const BottomBar = () => {
	return (
		<Menu fixed="bottom" inverted>
			<Container>
				<Popup
					inverted
					content="Settings"
					trigger={
						<Menu.Item>
							<Icon link size="large" name="settings" />
						</Menu.Item>
					}
				/>

				<Popup
					inverted
					content="Help"
					trigger={
						<Menu.Item>
							<Icon link size="large" name="question circle" />
						</Menu.Item>
					}
				/>

				{/* Separate links that opens a new tab in the browser */}

				<Menu.Menu position="right">
					<Popup
						inverted
						content="Documentation"
						trigger={
							<a
								href="https://mocha-downloader.github.io"
								target="_blank"
							>
								<Menu.Item>
									<Icon link size="large" name="book" />
								</Menu.Item>
							</a>
						}
					/>

					<Popup
						inverted
						content="Discord"
						trigger={
							<a
								href="https://discord.gg/aQqamSCUcS"
								target="_blank"
							>
								<Menu.Item>
									<Icon link size="large" name="discord" />
								</Menu.Item>
							</a>
						}
					/>

					<Popup
						inverted
						content="Source Code"
						trigger={
							<a
								href="https://github.com/Mocha-Downloader/mocha-downloader"
								target="_blank"
							>
								<Menu.Item>
									<Icon link size="large" name="github" />
								</Menu.Item>
							</a>
						}
					/>
				</Menu.Menu>
			</Container>
		</Menu>
	)
}

export default BottomBar
