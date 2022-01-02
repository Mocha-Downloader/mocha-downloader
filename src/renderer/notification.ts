import { store } from "react-notifications-component"

export function warning(title: string, message: string) {
	store.addNotification({
		title,
		message,
		type: "info",
		insert: "top",
		container: "top-left",
		animationIn: ["animate__animated", "animate__fadeIn"],
		animationOut: ["animate__animated", "animate__fadeOut"],
		dismiss: {
			duration: 7000,
			onScreen: true,
		},
	})
}

export default { warning }
