/**
 *  Shows a list of checkbox when there are multiple things to download
 *  e.g. youtube playlist, web comics, etc.
 */

import { useContext, useEffect } from "react"
import { Button, Checkbox, Icon, Modal, Table } from "semantic-ui-react"

import { globalContext, ActionsEnum } from "../ipc"

const SelectOptions = () => {
	const { globalState, dispatch } = useContext(globalContext)
	let isEverythingSelected = globalState.selectOptions.selectedChoices.every(
		(val) => val
	)
	// count the number of selected choices
	let selectedChoicesCount =
		globalState.selectOptions.selectedChoices.filter(Boolean).length
	const hide = () => {
		dispatch({ type: ActionsEnum.HIDE_SELECT_OPTIONS })
	}

	useEffect(() => {
		isEverythingSelected = globalState.selectOptions.selectedChoices.every(
			(val) => val
		)

		selectedChoicesCount =
			globalState.selectOptions.selectedChoices.filter(Boolean).length
	}, [globalState.selectOptions.selectedChoices])

	return (
		<Modal
			dimmer="blurring"
			open={globalState.selectOptions.isVisible}
			onClose={() => hide()}
		>
			<Modal.Header>Select items to download</Modal.Header>

			<Modal.Content scrolling>
				<Table striped>
					<Table.Body>
						{globalState.selectOptions.availableChoices?.map(
							(val, index) => (
								<Table.Row key={val.url}>
									<Table.Cell>
										<Checkbox
											checked={
												globalState.selectOptions
													.selectedChoices[index]
											}
											onChange={(_, data) => {
												dispatch({
													type: ActionsEnum.UPDATE_SELECT_OPTIONS,
													payload: {
														index: index,
														isSelected:
															!!data.checked,
													},
												})
											}}
											label={val.title}
										/>
									</Table.Cell>
									<Table.Cell>
										<a href={val.url} target="_blank">
											<Button compact floated="right">
												visit
											</Button>
										</a>
									</Table.Cell>
								</Table.Row>
							)
						)}
					</Table.Body>
				</Table>
			</Modal.Content>

			<Modal.Actions>
				<Button
					basic
					compact
					floated="left"
					onClick={() => {
						dispatch({
							type: ActionsEnum.SET_SELECT_OPTIONS,
							payload: Array(
								globalState.selectOptions.availableChoices
									.length
							).fill(!isEverythingSelected),
						})
					}}
				>
					{isEverythingSelected ? "Deselect all" : "Select all"}
				</Button>

				<Button onClick={() => hide()}>Cancel</Button>
				<Button
					primary
					icon
					labelPosition="right"
					disabled={!selectedChoicesCount}
					onClick={() => {
						hide()

						window.electron.ipcRenderer.send(
							"download",
							globalState.selectOptions.url,
							// indeces of selected values
							globalState.selectOptions.selectedChoices
								.map((value, index) => (value ? index : ""))
								.filter(String)
						)
					}}
				>
					Download ({selectedChoicesCount})
					<Icon name="arrow right" />
				</Button>
			</Modal.Actions>
		</Modal>
	)
}

export { SelectOptions }
