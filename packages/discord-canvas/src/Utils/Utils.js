class Util {
	/**
	 *
	 * @param {Number} number Currency of user
	 */
	static CurrencyFormat(number) {
		const lookup = [
			{ value: 1, symbol: '' },
			{ value: 1e3, symbol: 'K' },
			{ value: 1e6, symbol: 'M' },
			{ value: 1e9, symbol: 'B' },
			{ value: 1e12, symbol: 'T' },
			{ value: 1e15, symbol: 'P' },
			{ value: 1e18, symbol: 'E' },
			{ value: 1e21, symbol: 'Z' },
			{ value: 1e24, symbol: 'Y' }
		]
		const rx = /\.0+$|(\.[0-9]*[1-9])0+$/
		var item = lookup
			.slice()
			.reverse()
			.find(item => {
				return number >= item.value
			})

		return item ? (number / item.value).toFixed(1).replace(rx, '$1') + item.symbol : '0'
	}
}

module.exports = Util
