import { DownloadPayload } from "common/ipcTypes"
import downloadLogic from "./downloadLogic"

export type BatchFile = {
	version: "1.0"
	download: DownloadPayload[]
}

export default function parseFile(data: string) {
	const parsedData = JSON.parse(data) as BatchFile

	console.log(parsedData)
	parsedData.download.forEach((data) => {
		downloadLogic(data)
	})
}
