export default function rgbhex(r: number, g: number, b: number) {
	return `${componentToHex(r) + componentToHex(g) + componentToHex(b)}`
}

function componentToHex(c: number) {
	var hex = c.toString(16)
	return hex.length == 1 ? '0' + hex : hex
}
