export default function timestamp(
	timestamp: number,
	type:
		| 'fyh corta'
		| 'fyh larga'
		| 'f corta'
		| 'f larga'
		| 'h corta'
		| 'h larga'
		| 'relativo'
) {
	const unix = parseInt((timestamp / 1000).toFixed(0))
	const style =
		type == 'fyh corta' // 31 de diciembre de 1969 19:16
			? ':f'
			: type == 'fyh larga' // miércoles, 31 de diciembre de 1969 19:16
			? ':F'
			: type == 'f corta' // 31/12/1969
			? ':d'
			: type == 'f larga' // 31 de diciembre de 1969
			? ':D'
			: type == 'h corta' // 19:16
			? ':t'
			: type == 'h larga' // 19:16:40
			? ':T'
			: type == 'relativo' // hace 52 años
			? ':R'
			: '' // default: 31 de diciembre de 1969 19:16

	return `<t:${unix}${style}>`
}
