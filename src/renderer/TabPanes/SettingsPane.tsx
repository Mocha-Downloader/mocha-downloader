import { useTranslation } from "react-i18next"
import { Dropdown, Header } from "semantic-ui-react"

import { Locale } from "../../common/constants"
import { LanguageOptions } from "../../common/locales"
import { StyledPaneContainer } from "../components/Tabs"

const SettingsPane = () => {
	const { t, i18n } = useTranslation()

	return (
		<StyledPaneContainer>
			<Header size="huge" content={t("settings.settings")} dividing />

			<Header size="small" content={t("settings.language")} />
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

			<Header
				size="large"
				content={t("settings.platformSettings")}
				dividing
			/>

			{/* Naver Comics settings*/}

			<Header
				size="medium"
				content={t("settings.naverComics")}
				dividing
			/>

			<Header
				size="small"
				content={t("settings.maxConcurrentDownloads")}
			/>
			<Header size="small" content={t("settings.imageFormat")} />
			<Header size="small" content={t("settings.splitImages")} />

			{/* YouTube settings */}

			<Header size="medium" content={t("settings.youtube")} dividing />

			<Header
				size="small"
				content={t("settings.maxConcurrentDownloads")}
			/>
			<Header size="small" content={t("settings.videoFormat")} />
			<Header size="small" content={t("settings.videoResolution")} />
			<Header size="small" content={t("settings.audioBitrate")} />

			{/* Torrent settings */}

			<Header size="medium" content={t("settings.torrent")} dividing />
		</StyledPaneContainer>
	)
}

export default SettingsPane
