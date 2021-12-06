export default function isUrl(text: string) {
	const regexp = /^(https?|chrome?|edge):\/\/[^\s$.?#].[^\s]*$/
	return regexp.test(text)
}
