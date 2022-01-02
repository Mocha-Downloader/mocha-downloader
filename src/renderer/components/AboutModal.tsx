import { useContext } from "react"
import { Button, Header, Modal } from "semantic-ui-react"
import { useTranslation } from "react-i18next"

import { ActionsEnum } from "../../common/ipcTypes"
import { globalContext } from "../ipc"

const AboutModal = () => {
	const { t } = useTranslation()
	const { globalState, dispatch } = useContext(globalContext)

	return (
		<Modal
			open={globalState.aboutModalVisibility}
			onClose={() => dispatch({ type: ActionsEnum.HIDE_ABOUT_MODAL })}
			onOpen={() => dispatch({ type: ActionsEnum.SHOW_ABOUT_MODAL })}
		>
			<Header icon="info" content={t("about.title")} />

			<Modal.Content style={{ whiteSpace: "pre-line" }}>
				{t("about.description")}
				<br />
				<br />
				{t("about.version")}:{" "}
				<strong>{window.electron.data.appVersion}</strong>
				<br />
				<br />
				<strong>
					<a
						href="https://mocha-downloader.github.io/docs/licenses"
						target="_blank"
					>
						{t("about.licenses")}
					</a>
				</strong>
			</Modal.Content>

			<Modal.Actions>
				<Button
					onClick={() =>
						dispatch({ type: ActionsEnum.HIDE_ABOUT_MODAL })
					}
				>
					{t("about.close")}
				</Button>
			</Modal.Actions>
		</Modal>
	)
}

export default AboutModal
