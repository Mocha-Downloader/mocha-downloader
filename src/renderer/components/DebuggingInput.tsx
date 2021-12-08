/**
 * @file Where the link will be pasted for download.
 */

import { ChangeEvent, useState } from "react"
import { Input } from "semantic-ui-react"
import styled from "styled-components"

const StyledInput = styled(Input)`
	width: 100%;
`

const DebuggingInput = () => {
	const [query, setQuery] = useState("")

	const handleChange = (_: ChangeEvent, data: { value: string }) => {
		setQuery(data.value)
	}

	const handleKeyDown = (event: KeyboardEvent) => {
		if (event.key === "Enter") {
			setQuery("") // clear query

			window.electron.ipcRenderer.send({
				type: "download",
				payload: {
					type: "url",
					url: query,
				},
			})
		}
	}

	return (
		<StyledInput
			size="large"
			value={query}
			onChange={handleChange}
			onKeyDown={handleKeyDown}
		/>
	)
}

export default DebuggingInput
