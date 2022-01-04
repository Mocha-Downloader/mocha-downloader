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

// todo: user feedback for invalid file, empty file, and unreadable file
const DropZone = () => {
	const { t } = useTranslation()

	const onDrop = useCallback((acceptedFiles: File[]) => {
		acceptedFiles.forEach((file) => {
			const reader = new FileReader()

			reader.onload = () => {
				if (!reader.result) return

				window.electron.ipcRenderer.send({
					type: "fileDrop",
					payload: {
						name: file.name,
						content: reader.result,
					},
				})
			}

			file.name.endsWith(".torrent")
				? reader.readAsArrayBuffer(file)
				: reader.readAsText(file)
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
		accept: ".json,.jsonc,.torrent",
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
