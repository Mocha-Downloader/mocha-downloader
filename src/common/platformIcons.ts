import { platformID } from "./constants"

import bittorrent from "../../assets/platforms/bittorrent.png"
import comicNaverCom from "../../assets/platforms/comic.naver.com.png"
import webtoonKakaoCom from "../../assets/platforms/webtoon.kakao.com.png"
import youtubeCom from "../../assets/platforms/youtube.com.png"

export default {
	"comic.naver.com": comicNaverCom,
	"youtube.com": youtubeCom,
	bittorrent: bittorrent,
	"webtoon.kakao.com": webtoonKakaoCom,
} as { [key in platformID]: any }