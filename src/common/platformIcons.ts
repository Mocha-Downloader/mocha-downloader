import { platformID } from "./constants"

import bittorrent from "../../assets/platforms/bittorrent.png"
import comicNaverCom from "../../assets/platforms/comic.naver.com.png"
import youtubeCom from "../../assets/platforms/youtube.com.png"

import largeBittorrent from "../../assets/platforms/large/bittorrent.png"
import largeComicNaverCom from "../../assets/platforms/large/comic.naver.com.png"
import largeYoutubeCom from "../../assets/platforms/large/youtube.com.png"

export const largeIcons = {
	"comic.naver.com": largeComicNaverCom,
	"youtube.com": largeYoutubeCom,
	bittorrent: largeBittorrent,
} as { [key in platformID]: any }

export default {
	"comic.naver.com": comicNaverCom,
	"youtube.com": youtubeCom,
	bittorrent: bittorrent,
} as { [key in platformID]: any }
