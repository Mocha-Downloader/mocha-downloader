import { useTranslation } from "react-i18next"
import { Dropdown } from "semantic-ui-react"

import { Locale } from "common/constants"
import { StyledDownloadPaneContainer } from "../components/Tabs"

interface ILanguageOptions {
	key: Locale
	value: Locale
	flag: Locale
	text: string
}

const LanguageOptions: ILanguageOptions[] = [
	{ key: "ko", value: "ko", flag: "ko", text: "한국어 (Korean)" },
	{ key: "en", value: "en", flag: "en", text: "English" },
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
					if (value) i18n.changeLanguage(value as Locale)
				}}
			/>
		</StyledDownloadPaneContainer>
	)
}

export default SettingsPane
