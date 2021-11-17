import { css, createGlobalStyle } from "styled-components"

// css in createGlobalStyle doesn't get formatted for some reason
const globalStyleCSS = css`
	html,
	body,
	#root {
		height: 100vh;
	}

	.item:before {
		/* remove 1px outline from menu items */
		background: rgba(0, 0, 0, 0) !important;
	}

	/* scrollbar */

	::-webkit-scrollbar {
		width: 6px;
		height: 6px;
	}
	::-webkit-scrollbar-track {
		border-radius: 10px;
		background: rgba(0, 0, 0, 0.1);
	}
	::-webkit-scrollbar-thumb {
		border-radius: 10px;
		background: rgba(0, 0, 0, 0.2);
	}
	::-webkit-scrollbar-thumb:hover {
		background: rgba(0, 0, 0, 0.4);
	}
	::-webkit-scrollbar-thumb:active {
		background: rgba(0, 0, 0, 0.5);
	}
`

const globalStyle = createGlobalStyle`
	${globalStyleCSS}
`

export default globalStyle
