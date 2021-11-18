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

	await Promise.all(
		sizes.map(async (size) => {
			const resizedImage = original.resize(size, size)
			const fileName = `assets/icons/${size}x${size}.png`

			await resizedImage.toFile(fileName)
			if ([16, 24, 32, 48, 64, 128, 256].includes(size))
				imageFiles.push(fs.readFileSync(fileName))
		})
	)

	toIco(imageFiles).then((result) => {
		fs.writeFileSync("assets/icon.ico", result)
	})

	// todo: .icns file for apple
}

main()
