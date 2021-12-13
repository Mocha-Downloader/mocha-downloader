import { useContext } from "react"
import { Menu, Container, Icon, Popup } from "semantic-ui-react"
import { useTranslation } from "react-i18next"

import { globalContext } from "../ipc"
import { ActionsEnum } from "../../common/ipcTypes"
import { TabEnum } from "./Tabs"

const BottomBar = () => {
	const { dispatch } = useContext(globalContext)
	const { t } = useTranslation()

	return (
		<Menu fixed="bottom" inverted>
			<Container>
				<Popup
					inverted
					content={t("bottomBarTooltips.download")}
					trigger={
						<Menu.Item
							onClick={() => {
								dispatch({
									type: ActionsEnum.SET_TAB_INDEX,
									payload: TabEnum.DOWNLOAD,
								})
							}}
						>
							<Icon link size="large" name="download" />
						</Menu.Item>
					}
				/>

				<Popup
					inverted
					content={t("bottomBarTooltips.settings")}
					trigger={
						<Menu.Item
							onClick={() => {
								dispatch({
									type: ActionsEnum.SET_TAB_INDEX,
									payload: TabEnum.SETTINGS,
								})
							}}
						>
							<Icon link size="large" name="settings" />
						</Menu.Item>
					}
				/>

				{/* Separate links that opens a new tab in the browser */}

				<Menu.Menu position="right">
					<Popup
						inverted
						content={t("bottomBarTooltips.documentation")}
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
						content={t("bottomBarTooltips.discord")}
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
						content={t("bottomBarTooltips.sourceCode")}
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
