import { render } from "react-dom"

import { GlobalStore } from "./ipc"

import App from "./App"

render(
	<GlobalStore>
		<App />
	</GlobalStore>,
	document.getElementById("root")
)
