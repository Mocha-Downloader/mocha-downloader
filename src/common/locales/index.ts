import en from "./en.json"
import ko from "./ko.json"

import { FlagNameValues } from "semantic-ui-react"

import { Locale } from "common/constants"

export const defaultLang = "en"

export interface ILanguageOptions {
	key: Locale
	value: Locale
	flag: FlagNameValues
	text: string
}

export const LanguageOptions: ILanguageOptions[] = [
	{ key: "ko", value: "ko", flag: "south korea", text: "한국어 (Korean)" },
	{ key: "en", value: "en", flag: "united states", text: "English" },
]

export default {
	en: { translation: en },
	ko: { translation: ko },
}
