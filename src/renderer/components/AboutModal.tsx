import { useContext } from "react"
import { Button, Header, Modal } from "semantic-ui-react"

import { ActionsEnum } from "common/ipcTypes"
import { globalContext } from "../ipc"

const AboutModal = () => {
	// known bug: https://github.com/electron/electron/issues/7085

	const { globalState, dispatch } = useContext(globalContext)
	const { platform, arch, release } = window.electron.data.os

	return (
		<Modal
			open={globalState.aboutModalVisibility}
			onClose={() => dispatch({ type: ActionsEnum.HIDE_ABOUT_MODAL })}
			onOpen={() => dispatch({ type: ActionsEnum.SHOW_ABOUT_MODAL })}
		>
			<Header icon="info" content="Mocha Downloader" />

			<Modal.Content style={{ whiteSpace: "pre-line" }}>
				A GUI tool for searching, parsing, and downloading contents from
				the web.
				<br />
				<br />
				Version: <strong>{window.electron.data.appVersion}</strong>
				<br />
				OS:{" "}
				<strong>
					{platform} {arch} {release}
				</strong>
				<br />
				<br />
				<strong>
					<a
						href="https://mocha-downloader.github.io/docs/licenses"
						target="_blank"
					>
						LICENSES
					</a>
				</strong>
			</Modal.Content>

			<Modal.Actions>
				<Button
					onClick={() =>
						dispatch({ type: ActionsEnum.HIDE_ABOUT_MODAL })
					}
				>
					OK
				</Button>
			</Modal.Actions>
		</Modal>
	)
}

export default AboutModal
