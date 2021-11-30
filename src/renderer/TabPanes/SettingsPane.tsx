import { useTranslation } from "react-i18next"
import { Dropdown, FlagNameValues } from "semantic-ui-react"

import { Locale } from "common/constants"
import { StyledDownloadPaneContainer } from "../components/Tabs"

interface ILanguageOptions {
	key: Locale
	value: Locale
	flag: FlagNameValues
	text: string
}

const LanguageOptions: ILanguageOptions[] = [
	{ key: "ko", value: "ko", flag: "south korea", text: "한국어 (Korean)" },
	{ key: "en", value: "en", flag: "united states", text: "English" },
]

const SettingsPane = () => {
	const { i18n } = useTranslation()

	return (
		<StyledDownloadPaneContainer>
			<Dropdown
				placeholder="Select Language"
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
		</StyledDownloadPaneContainer>
	)
}

export default SettingsPane
