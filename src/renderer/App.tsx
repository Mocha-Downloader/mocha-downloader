import { initReactI18next } from "react-i18next"
import styled from "styled-components"
import i18n from "i18next"

import AboutModal from "./components/AboutModal"
import BottomBar from "./components/BottomBar"
import SelectOptions from "./components/SelectOptions"
import Tabs from "./components/Tabs"
import TopBar from "./components/TopBar"

import locales from "common/locales"

import GlobalStyle from "./globalStyle"
import "semantic-ui-css/semantic.min.css"

i18n.use(initReactI18next).init({
	resources: locales,
	fallbackLng: "en",
	interpolation: {
		// react already safes from xss => https://www.i18next.com/translation-function/interpolation#unescape
		escapeValue: false,
	},
})

const StyledAppContentGrid = styled.div`
	display: grid;

	height: 100vh;
	width: 100vw;

	/*
	grid-template-columns: 1fr;
	grid-template-rows: 4rem 1fr 4rem;
	*/
`

const App = () => {
	return (
		<>
			<GlobalStyle />

			<StyledAppContentGrid>
				<TopBar />
				<Tabs />
				<BottomBar />
			</StyledAppContentGrid>

			<SelectOptions />
			<AboutModal />
		</>
	)
}

export default App
