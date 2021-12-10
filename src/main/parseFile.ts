import { DownloadData } from "common/ipcTypes"
import parseURL from "./parseURL"

export type BatchFile = {
	version: "1.0"
	download: DownloadData[]
}

export default function parseFile(data: string) {
	const parsedData = JSON.parse(data) as BatchFile

	console.log(parsedData)
	parsedData.download.forEach((data) => {
		parseURL(data)
	})
}
