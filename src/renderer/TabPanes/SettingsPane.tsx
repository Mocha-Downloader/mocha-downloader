import { useTranslation } from "react-i18next"
import { Checkbox, Dropdown, Header, Input } from "semantic-ui-react"

import { Locale } from "../../common/constants"
import { LanguageOptions } from "../../common/locales"
import { StyledPaneContainer } from "../components/Tabs"

const SettingsPane = () => {
	const { i18n } = useTranslation()

	return (
		<StyledPaneContainer>
			<Header size="huge" content="Settings" />

			<Header size="medium" content="Language" dividing />
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

			<Header size="medium" content="Network" dividing />
			<Checkbox label="use tor" />

			<Header size="medium" content="proxy" />
			<Input size="mini" />

			<Header size="medium" content="Etc" dividing />
			<Checkbox label="auto update" />

			<Header size="large" content="Platform settings" dividing />

			<Header size="medium" content="File" dividing />

			<Header size="medium" content="Naver Comics" dividing />

			<Header size="medium" content="YouTube" dividing />

			<Header size="medium" content="Torrent" dividing />
		</StyledPaneContainer>
	)
}

export default SettingsPane
