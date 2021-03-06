/**
 * @file Shows a list of checkbox when there are multiple things to download.
 * e.g. youtube playlist, web comics, etc.
 */

import { useContext, useEffect } from "react"
import { Button, Checkbox, Icon, Modal, Table } from "semantic-ui-react"

import { ActionsEnum } from "../../common/ipcTypes"
import { globalContext } from "../ipc"

const SelectOptions = () => {
	const { globalState, dispatch } = useContext(globalContext)
	const { selectOptions } = globalState

	let isEverythingSelected = selectOptions.selectedChoices.every((val) => val)
	// count the number of selected choices
	let selectedChoicesCount =
		selectOptions.selectedChoices.filter(Boolean).length
	const hide = () => {
		dispatch({ type: ActionsEnum.HIDE_SELECT_OPTIONS })
	}

	useEffect(() => {
		isEverythingSelected = selectOptions.selectedChoices.every((val) => val)

		selectedChoicesCount =
			selectOptions.selectedChoices.filter(Boolean).length
	}, [selectOptions.selectedChoices])

	return (
		<Modal
			dimmer="blurring"
			open={selectOptions.isVisible}
			onClose={() => hide()}
		>
			<Modal.Header>Select items to download</Modal.Header>

			<Modal.Content scrolling>
				<Table striped>
					<Table.Body>
						{selectOptions.availableChoices?.map((val, index) => (
							<Table.Row key={val.url}>
								<Table.Cell>
									<Checkbox
										checked={
											selectOptions.selectedChoices[index]
										}
										onChange={(_, data) => {
											dispatch({
												type: ActionsEnum.UPDATE_SELECT_OPTIONS,
												payload: {
													index: index,
													isSelected: !!data.checked,
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
						))}
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
								selectOptions.availableChoices.length
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

						window.electron.ipcRenderer.send({
							type: "download",
							payload: {
								data: selectOptions.url,
								options: {
									// https://stackoverflow.com/a/41271541/12979111
									selected:
										selectOptions.selectedChoices.reduce(
											(prev, curr, i) => {
												if (curr) prev.push(i)
												return prev
											},
											[] as number[]
										),
								},
							},
						})
					}}
				>
					Download ({selectedChoicesCount})
					<Icon name="arrow right" />
				</Button>
			</Modal.Actions>
		</Modal>
	)
}

export default SelectOptions
