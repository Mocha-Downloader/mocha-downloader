/**
 *  Shows a list of checkbox when there are multiple things to download
 *  e.g. youtube playlist, web comics, etc.
 */

import { useContext } from "react"
import { Button, Checkbox, Icon, List, Modal } from "semantic-ui-react"

import { globalContext, ActionsEnum } from "../ipc"

function SelectOptions() {
	const { globalState, dispatch } = useContext(globalContext)

	return (
		<Modal
			dimmer="blurring"
			open={globalState.openSelectOptions}
			onClose={() =>
				dispatch({
					type: ActionsEnum.HIDE_SELECT_OPTIONS,
				})
			}
		>
			<Modal.Header>Select episodes to download</Modal.Header>

			<Modal.Content scrolling>
				Placeholder checkboxes:
				<List>
					<List.Item>
						<Checkbox label="1" />
					</List.Item>
					<List.Item>
						<Checkbox label="2" />
					</List.Item>
					<List.Item>
						<Checkbox label="3" />
					</List.Item>
					<List.Item>
						<Checkbox label="4" />
					</List.Item>
					<List.Item>
						<Checkbox label="5" />
					</List.Item>
					<List.Item>
						<Checkbox label="6" />
					</List.Item>
					<List.Item>
						<Checkbox label="7" />
					</List.Item>
					<List.Item>
						<Checkbox label="8" />
					</List.Item>
					<List.Item>
						<Checkbox label="9" />
					</List.Item>
					<List.Item>
						<Checkbox label="10" />
					</List.Item>
					<List.Item>
						<Checkbox label="11" />
					</List.Item>
					<List.Item>
						<Checkbox label="12" />
					</List.Item>
					<List.Item>
						<Checkbox label="13" />
					</List.Item>
					<List.Item>
						<Checkbox label="14" />
					</List.Item>
					<List.Item>
						<Checkbox label="15" />
					</List.Item>
					<List.Item>
						<Checkbox label="16" />
					</List.Item>
					<List.Item>
						<Checkbox label="17" />
					</List.Item>
					<List.Item>
						<Checkbox label="18" />
					</List.Item>
					<List.Item>
						<Checkbox label="19" />
					</List.Item>
					<List.Item>
						<Checkbox label="20" />
					</List.Item>
				</List>
			</Modal.Content>

			<Modal.Actions>
				<Button
					onClick={() =>
						dispatch({
							type: ActionsEnum.HIDE_SELECT_OPTIONS,
						})
					}
				>
					Cancel
				</Button>
				<Button
					primary
					icon
					labelPosition="right"
					onClick={() =>
						dispatch({
							type: ActionsEnum.HIDE_SELECT_OPTIONS,
						})
					}
				>
					Download
					<Icon name="arrow right" />
				</Button>
			</Modal.Actions>
		</Modal>
	)
}

export { SelectOptions }
