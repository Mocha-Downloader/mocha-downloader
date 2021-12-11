import { useTranslation } from "react-i18next"
import {
	Checkbox,
	Dropdown,
	FlagNameValues,
	Header,
	Input,
} from "semantic-ui-react"

import { Locale } from "../../common/constants"
import { StyledPaneContainer } from "../components/Tabs"

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
		<StyledPaneContainer>
			<Header size="huge" content="Settings" />
			<Header size="medium" content="Appearance" dividing />
			theme
			<Header size="medium" content="Language" dividing />
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
			<Header size="medium" content="Network" dividing />
			<Checkbox label="use tor" />
			<Header size="medium" content="proxy" />
			<Input size="mini" />
			<Header size="medium" content="Etc" dividing />
			auto update
		</StyledPaneContainer>
	)
}

export default SettingsPane
