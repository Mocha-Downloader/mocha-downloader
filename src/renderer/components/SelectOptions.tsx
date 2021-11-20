/**
 *  Shows a list of checkbox when there are multiple things to download
 *  e.g. youtube playlist, web comics, etc.
 */

import { useContext } from "react"
import { Button, Checkbox, Icon, Modal, Table } from "semantic-ui-react"

import { globalContext, ActionsEnum } from "../ipc"

function SelectOptions() {
	const { globalState, dispatch } = useContext(globalContext)

	const hide = () => {
		dispatch({ type: ActionsEnum.HIDE_SELECT_OPTIONS })
	}

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
							(val) => (
								<Table.Row key={val.url}>
									<Table.Cell>
										<Checkbox
											defaultChecked
											// onChange={(_, data) => {
											// 	setSelectedChoices(index, data.checked)
											// }}
											label={val.title}
										/>
									</Table.Cell>
									<Table.Cell>
										<a href={val.url} target="_">
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
				<Button onClick={() => hide()}>Cancel</Button>
				<Button
					primary
					icon
					labelPosition="right"
					onClick={() => {
						hide()

						window.electron.ipcRenderer.send(
							"download",
							globalState.selectOptions.url,
							globalState.selectOptions.selectedChoices
						)
					}}
				>
					Download
					<Icon name="arrow right" />
				</Button>
			</Modal.Actions>
		</Modal>
	)
}

export { SelectOptions }
