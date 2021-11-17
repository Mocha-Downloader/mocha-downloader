/**
 *  Fix for https://github.com/electron-react-boilerplate/electron-react-boilerplate/issues/3034
 */

import fs from "fs"

function removeDoubleSemi(path: string) {
	fs.readFile(path, "utf8", (err, data) => {
		if (err) return console.log(err)

		const result = data.replace(/;;/g, ";")

		fs.writeFile(path, result, "utf8", (err) => {
			if (err) return console.log(err)
		})
	})
}

removeDoubleSemi("node_modules/semantic-ui-css/semantic.min.css")
removeDoubleSemi("node_modules/semantic-ui-css/semantic.css")
