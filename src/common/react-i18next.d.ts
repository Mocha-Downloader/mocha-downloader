import resources, { defaultLang } from "./locales"

declare module "react-i18next" {
	interface CustomTypeOptions {
		defaultNS: typeof defaultLang
		resources: typeof resources["en"]
	}
}
