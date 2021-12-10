/**
 * @file Where the link will be pasted for download.
 */

import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button, Popup } from "semantic-ui-react"

const timeoutLength = 2500
let timeout: NodeJS.Timeout

const PasteButton = () => {
	const [isLoading] = useState(false)
	const [isOpened, setOpened] = useState(false)
	const { t } = useTranslation()

	return (
		<Popup
			trigger={
				<Button
					loading={isLoading}
					icon="cloud download"
					content={t("topBar.paste")}
					onClick={() => {
						window.electron.ipcRenderer.send({
							type: "download",
							payload: {
								type: "url",
								data: {
									data: window.electron.readClipboardText(),
								},
							},
						})
					}}
				/>
			}
			content="Pasted!"
			on="click"
			open={isOpened}
			onClose={() => {
				setOpened(false)
				clearTimeout(timeout)
			}}
			onOpen={() => {
				setOpened(true)

				timeout = setTimeout(() => {
					setOpened(false)
				}, timeoutLength)
			}}
		/>
	)
}

export default PasteButton
