export type platformID =
	| "comic.naver.com"
	| "youtube.com"
	| "bittorrent"
	| "webtoon.kakao.com"

export const platformID2NameMap: { [key in platformID]: string } = {
	"comic.naver.com": "Naver Comics",
	"youtube.com": "YouTube",
	bittorrent: "Torrent",
	"webtoon.kakao.com": "Kakao Webtoon",
}
