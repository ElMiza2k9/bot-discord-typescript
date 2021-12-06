import pretty from 'pretty-ms'

export default function ms(milliseconds) {
	return pretty(milliseconds, { colonNotation: true, secondsDecimalDigits: 0 })
}
