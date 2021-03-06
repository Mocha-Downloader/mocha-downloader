import { useTranslation } from "react-i18next"
import { Container, Menu } from "semantic-ui-react"
import styled from "styled-components"

import PasteButton from "./PasteButton"

const StyledContainer = styled(Container)`
	display: flex;
	justify-content: space-between;
`

const TopBar = () => {
	const { t } = useTranslation()

	return (
		<Menu fixed="top" inverted>
			<StyledContainer>
				<Menu.Item header>{t("appName")}</Menu.Item>

				<Menu.Item>
					<PasteButton />
				</Menu.Item>
			</StyledContainer>
		</Menu>
	)
}

export default TopBar
