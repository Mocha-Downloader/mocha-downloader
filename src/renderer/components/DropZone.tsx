/**
 * @file zone for file drag and drop
 */

import { CSSProperties, useCallback, useMemo } from "react"
import { useTranslation } from "react-i18next"
import { useDropzone } from "react-dropzone"

const baseStyle: CSSProperties = {
	flex: 1,
	cursor: "pointer",
	userSelect: "none",
	display: "flex",
	flexDirection: "column",
	alignItems: "center",
	padding: "20px",
	borderWidth: 2,
	borderRadius: 2,
	borderColor: "#eeeeee",
	borderStyle: "dashed",
	backgroundColor: "#fafafa",
	color: "#bdbdbd",
	outline: "none",
	transition: "border .24s ease-in-out",
}

const DropZone = () => {
	const { t } = useTranslation()

	const onDrop = useCallback((acceptedFiles: File[]) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader()

			reader.onabort = () => {
				console.log("file reading was aborted")
			}

			reader.onerror = () => {
				console.log("file reading has failed")
			}

			reader.onload = () => {
				const fileContent: string = reader.result as string

				// todo: user feedback for invalid file, empty file, and unreadable file
				if (!fileContent) return

				window.electron.ipcRenderer.send({
					type: "fileDrop",
					payload: fileContent,
				})
			}

			reader.readAsText(file)
		})
	}, [])

	const {
		getRootProps,
		getInputProps,
		isDragActive,
		isDragAccept,
		isDragReject,
	} = useDropzone({
		onDrop,

		// accept json and commented json files only
		accept: ".json,.jsonc",
	})

	// todo: investigate color indication not working properly
	const style = useMemo(
		() => ({
			...baseStyle,
			...(isDragActive && { borderColor: "#2196f3" }),
			...(isDragAccept && { borderColor: "#00e676" }),
			...(isDragReject && { borderColor: "#ff1744" }),
		}),
		[isDragActive, isDragReject, isDragAccept]
	)

	return (
		<div {...getRootProps({ style })}>
			<input {...getInputProps()} />
			<p>{t("instructions.drop")}</p>
		</div>
	)
}

export default DropZone
