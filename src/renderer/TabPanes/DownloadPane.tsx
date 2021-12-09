import {
	CSSProperties,
	useCallback,
	useContext,
	useEffect,
	useMemo,
	useState,
} from "react"
import { Card, Header } from "semantic-ui-react"
import { useTranslation } from "react-i18next"
import { useDropzone } from "react-dropzone"
import styled from "styled-components"

import { globalContext } from "../ipc"

import AnimatedLogo from "../components/AnimatedLogo"
import DownloadCard from "../components/DownloadCard"
import DebuggingInput from "../components/DebuggingInput"
import { StyledPaneContainer } from "../components/Tabs"

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

const StyledInstructions = styled.div`
	display: flex;
	justify-content: center;
	user-select: none;
`

const DownloadPane = () => {
	const { globalState } = useContext(globalContext)
	const [downloadCardsCount, setDownloadCardsCount] = useState(0)
	const { t } = useTranslation()

	useEffect(() => {
		setDownloadCardsCount(Object.keys(globalState.downloadCards).length)
	}, [globalState])

	/**
	 * Drag 'n' drop
	 */

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

				// todo: start batch download
				const batchDownloadData = JSON.parse(fileContent)

				console.log(batchDownloadData)
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
		<StyledPaneContainer>
			{window.electron.isDev && (
				<>
					<DebuggingInput />
					<br />
					<br />
				</>
			)}

			<Card.Group>
				{Object.entries(globalState.downloadCards).map(
					([key, downloadCardProps]) => {
						return <DownloadCard key={key} {...downloadCardProps} />
					}
				)}
			</Card.Group>

			<br />

			{downloadCardsCount <= 0 ? (
				<StyledInstructions>
					<Header size="huge" icon>
						{/* https://en.wikipedia.org/wiki/Caffeine */}
						<AnimatedLogo size={100} />
						{t("instructions.header")}
						<Header.Subheader>
							{t("instructions.subheader")}
						</Header.Subheader>
					</Header>
				</StyledInstructions>
			) : (
				<AnimatedLogo size={50} />
			)}

			<br />

			<div {...getRootProps({ style })}>
				<input {...getInputProps()} />
				<p>{t("instructions.drop")}</p>
			</div>
		</StyledPaneContainer>
	)
}

export default DownloadPane
