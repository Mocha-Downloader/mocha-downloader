import { useTranslation } from "react-i18next"
import { Container, Menu } from "semantic-ui-react"
import styled from "styled-components"

import SearchBox from "./SearchBox"

const StyledContainer = styled(Container)`
	height: 4rem;
	display: flex;
	justify-content: space-between;
`

const StyledSearchBoxContainer = styled.div`
	display: flex;
	align-items: center;
	width: 100%;
	padding-left: 2rem;
`

const TopBar = () => {
	const { t } = useTranslation()

	return (
		<Menu fixed="top" inverted>
			<StyledContainer>
				<Menu.Item header>{t("appName")}</Menu.Item>
				<StyledSearchBoxContainer>
					<SearchBox />
				</StyledSearchBoxContainer>
			</StyledContainer>
		</Menu>
	)
}

export default TopBar
