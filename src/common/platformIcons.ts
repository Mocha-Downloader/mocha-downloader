import { platformID } from "./constants"

import bittorrent from "../../assets/platforms/bittorrent.png"
import comicNaverCom from "../../assets/platforms/comic.naver.com.png"
import youtubeCom from "../../assets/platforms/youtube.com.png"

export default {
	"comic.naver.com": comicNaverCom,
	"youtube.com": youtubeCom,
	bittorrent: bittorrent,
} as { [key in platformID]: any }
