import { useTranslation } from "react-i18next"
import { Dropdown, Header } from "semantic-ui-react"

import { Locale } from "../../common/constants"
import { LanguageOptions } from "../../common/locales"
import { StyledPaneContainer } from "../components/Tabs"

const SettingsPane = () => {
	const { i18n } = useTranslation()

	return (
		<StyledPaneContainer>
			<Header size="huge" content="Settings" dividing />

			<Header size="small" content="Language" />
			<Dropdown
				search
				selection
				defaultValue="en"
				options={LanguageOptions}
				onChange={(_, { value }) => {
					const locale: Locale = value as Locale

					if (!value) return

					i18n.changeLanguage(locale)
					window.electron.ipcRenderer.send({
						type: "changeLang",
						payload: locale,
					})
				}}
			/>

			<Header size="large" content="Platform settings" dividing />

			{/* Naver Comics settings*/}

			<Header size="medium" content="Naver Comics" dividing />

			<Header size="small" content="Maximum concurrent downloads" />
			<Header size="small" content="Image format" />
			<Header size="small" content="split images" />

			{/* YouTube settings */}

			<Header size="medium" content="YouTube" dividing />

			<Header size="small" content="Maximum concurrent downloads" />
			<Header size="small" content="video format" />
			<Header size="small" content="video resolution" />
			<Header size="small" content="audio bitrate" />

			{/* Torrent settings */}

			<Header size="medium" content="Torrent" dividing />
		</StyledPaneContainer>
	)
}

export default SettingsPane
