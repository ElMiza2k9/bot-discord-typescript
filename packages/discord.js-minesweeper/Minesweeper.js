'use strict'
class Minesweeper {
	/**
	 * The constructor of the Minesweeper class.
	 * @constructor
	 * @typedef {{rows?: number;columns?: number;mines?: number;emote?: string;revealFirstCell?: boolean;zeroFirstCell?: boolean;spaces?: boolean;returnType?: 'emoji' | 'code' | 'matrix';}} MinesweeperOptions
	 * @param {MinesweeperOptions} opts - The options of the Minesweeper class.
	 */
	constructor(opts = undefined) {
		this.safeCells = []
		this.rows = (opts && opts.rows) || 9
		this.columns = (opts && opts.columns) || 9
		this.mines = (opts && opts.mines) || 10
		this.emote = (opts && opts.emote) || 'boom'
		this.revealFirstCell =
			opts && opts.revealFirstCell !== undefined ? opts.revealFirstCell : false
		this.zeroFirstCell =
			opts && opts.zeroFirstCell !== undefined ? opts.zeroFirstCell : true
		this.spaces = opts && opts.spaces !== undefined ? opts.spaces : true
		this.returnType = (opts && opts.returnType) || 'emoji'
		this.matrix = []
		this.types = {
			mine: `|| ${this.emote} ||`,
			numbers: [
				'zero',
				'one',
				'two',
				'three',
				'four',
				'five',
				'six',
				'seven',
				'eight'
			].map(n => this.spoilerize(n))
		}
	}
	/**
	 * Turns a text into a Discord spoiler.
	 * @param {string} str - The string to spoilerize.
	 * @returns {string}
	 */
	spoilerize(str) {
		return this.spaces ? `|| :${str}: ||` : `||:${str}:||`
	}
	/**
	 * Fills the matrix with "zero" emojis.
	 */
	generateEmptyMatrix() {
		for (let i = 0; i < this.rows; i++) {
			const arr = new Array(this.columns).fill(this.types.numbers[0])
			this.matrix.push(arr)
		}
	}
	/**
	 * Plants mines in the matrix randomly.
	 */
	plantMines() {
		for (let i = 0; i < this.mines; i++) {
			const x = Math.floor(Math.random() * this.rows)
			const y = Math.floor(Math.random() * this.columns)
			if (this.matrix[x][y] === this.types.mine) {
				i--
			} else {
				this.matrix[x][y] = this.types.mine
			}
		}
	}
	/**
	 * Gets the number of mines in a particular (x, y) coordinate
	 * of the matrix.
	 * @param {number} x - The x coordinate (row).
	 * @param {number} y - The y coordinate (column).
	 * @returns {string}
	 */
	getNumberOfMines(x, y) {
		if (this.matrix[x][y] === this.types.mine) {
			return this.types.mine
		}
		this.safeCells.push({ x, y })
		let counter = 0
		const hasLeft = y > 0
		const hasRight = y < this.columns - 1
		const hasTop = x > 0
		const hasBottom = x < this.rows - 1
		// top left
		counter += +(hasTop && hasLeft && this.matrix[x - 1][y - 1] === this.types.mine)
		// top
		counter += +(hasTop && this.matrix[x - 1][y] === this.types.mine)
		// top right
		counter += +(hasTop && hasRight && this.matrix[x - 1][y + 1] === this.types.mine)
		// left
		counter += +(hasLeft && this.matrix[x][y - 1] === this.types.mine)
		// right
		counter += +(hasRight && this.matrix[x][y + 1] === this.types.mine)
		// bottom left
		counter += +(hasBottom && hasLeft && this.matrix[x + 1][y - 1] === this.types.mine)
		// bottom
		counter += +(hasBottom && this.matrix[x + 1][y] === this.types.mine)
		// bottom right
		counter += +(hasBottom && hasRight && this.matrix[x + 1][y + 1] === this.types.mine)
		return this.types.numbers[counter]
	}
	/**
	 * Returns the Discord message equivalent of the mine field.
	 * @returns {string}
	 */
	getTextRepresentation() {
		const separator = this.spaces ? ' ' : ''
		return this.matrix.map(r => r.join(separator)).join('\n')
	}
	/**
	 * Populates the matrix.
	 */
	populate() {
		this.matrix = this.matrix.map((row, x) => {
			return row.map((col, y) => this.getNumberOfMines(x, y))
		})
	}
	/**
	 * Reveal a random cell.
	 * @typedef {{x: number; y: number;}} SafeCell
	 * @returns {SafeCell}
	 */
	revealFirst() {
		/**
		 * Thanks to @FungiOfDeath and @TheSorton on Github for
		 * bringing this up!
		 */
		if (!this.revealFirstCell) {
			return { x: -1, y: -1 }
		}
		const zeroCells = this.safeCells.filter(
			c => this.matrix[c.x][c.y] === this.types.numbers[0]
		)
		if (this.zeroFirstCell && zeroCells.length > 0) {
			const safeCell = zeroCells[Math.floor(Math.random() * zeroCells.length)]
			const x = safeCell.x
			const y = safeCell.y
			const cell = this.matrix[x][y]
			this.matrix[x][y] = cell.slice(2, -2)
			this.revealSurroundings(safeCell)
			return { x, y }
		} else {
			const safeCell = this.safeCells[Math.floor(Math.random() * this.safeCells.length)]
			const x = safeCell.x
			const y = safeCell.y
			const cell = this.matrix[x][y]
			this.matrix[x][y] = cell.slice(2, -2)
			return { x, y }
		}
	}
	/**
	 * Reveals all cells surrounding a cell. Only meant to be used for zero-cells during initial construction.
	 * @param {SafeCell} c - A SafeCell to reveal around. This should only be a zero-cell!
	 * @param {boolean} recurse - Whether to recursively reveal following zero-cells. Defaults to true.
	 */
	revealSurroundings(c, recurse = true) {
		const isSpoiler = (x, y) => this.matrix[x][y].includes('||')
		const x = c.x
		const y = c.y
		const xLower = Math.max(0, x - 1)
		const yLower = Math.max(0, y - 1)
		const xUpper = Math.min(this.rows - 1, x + 1)
		const yUpper = Math.min(this.columns - 1, y + 1)
		let zeroCells = []
		for (let i = xLower; i <= xUpper; i++) {
			for (let j = yLower; j <= yUpper; j++) {
				if (isSpoiler(i, j)) {
					if (this.matrix[i][j] === this.types.numbers[0]) {
						zeroCells.push({ x: i, y: j })
					}
					this.matrix[i][j] = this.matrix[i][j].slice(2, -2)
				}
			}
		}
		if (recurse) {
			zeroCells.forEach(c => this.revealSurroundings(c, true))
		}
	}
	/**
	 * Generates a minesweeper mine field and returns it.
	 * @returns {(string | string[][] | null)}
	 */
	start() {
		if (this.rows * this.columns <= this.mines * 2) {
			return null
		}
		this.generateEmptyMatrix()
		this.plantMines()
		this.populate()
		this.revealFirst()
		switch (this.returnType) {
			case 'emoji':
				return this.getTextRepresentation()
			case 'code':
				return `\`\`\`${this.getTextRepresentation()}\`\`\``
			case 'matrix':
				return this.matrix
		}
	}
}
module.exports = Minesweeper
