import sharp from "sharp"
import fs from "fs"
import toIco from "to-ico"

async function main() {
	const original = sharp("assets/icon.svg", {
		raw: { height: 1024, width: 1024, channels: 4 },
	})

	original.toFile("assets/icon.png")

	const sizes = [16, 24, 32, 48, 64, 96, 128, 256, 512, 1024]
	const imageFiles: Buffer[] = []
	sizes.map((size) => {
		const fileName = `assets/icons/${size}x${size}.png`
		original
			.resize(size, size)
			.toFile(fileName)
			.then(() => {
				imageFiles.push(fs.readFileSync(fileName))
			})
	})

	toIco(imageFiles, { sizes: sizes, resize: true }).then((result) => {
		fs.writeFileSync("assets/icon.ico", result)
	})

	// todo: .icns file for apple
}

main()
