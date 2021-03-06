/**
 * Minesweeper options.
 * @typedef {object} MinesweeperOpts
 * @property {number} [rows] - The number of rows in the mine field. Defaults to 9.
 * @property {number} [columns] - The number of columns in the mine field. Defaults to 9.
 * @property {number} [mines] - The number of mines in the mine field. Defaults to 10.
 * @property {string} [emote] - The emote used as a mine. Defaults to "boom".
 * @property {boolean} [revealFirstCell] - Whether or not the first cell should be revealed (like in regular Minesweeper). Defaults to FALSE.
 * @property {boolean} [zeroFirstCell] - Whether or not the first cell revealed should always be a zero (and automatically reveal any surrounding safe cells). Does nothing if `revealFirstCell` is false. Defaults to true.
 * @property {boolean} [spaces] - Specifies whether or not the emojis should be surrounded by spaces. Defaults to true.
 * @property {'emoji' | 'code' | 'matrix'} - The type of the returned data. Defaults to "emoji".
 */
interface MinesweeperOpts {
	rows?: number
	columns?: number
	mines?: number
	emote?: string
	revealFirstCell?: boolean
	zeroFirstCell?: boolean
	spaces?: boolean
	returnType?: 'emoji' | 'code' | 'matrix'
}
/**
 * Cell types.
 * @typedef {object} CellTypes
 * @property {string} mine - The definition of a mine string.
 * @property {string[]} numbers - The numbers as emote names.
 */
interface CellTypes {
	mine: string
	numbers: string[]
}
/**
 * Safe cell. Defines the coordinates of a safe cell.
 * @typedef {object}SafeCell
 * @property {number} x - row id
 * @property {number} y - column id
 */
interface SafeCell {
	x: number
	y: number
}
declare class Minesweeper {
	readonly rows: number
	readonly columns: number
	readonly mines: number
	readonly emote: string
	readonly spaces: boolean
	readonly revealFirstCell: boolean
	readonly zeroFirstCell: boolean
	readonly safeCells: SafeCell[]
	readonly returnType: 'emoji' | 'code' | 'matrix'
	readonly types: CellTypes
	matrix: string[][]
	/**
	 * The constructor of the Minesweeper class.
	 * @constructor
	 * @param {MinesweeperOpts} opts - The options of the Minesweeper class.
	 */
	constructor(opts?: MinesweeperOpts | undefined)
	/**
	 * Turns a text into a Discord spoiler.
	 * @param {string} str - The string to spoilerize.
	 * @returns {string}
	 */
	spoilerize(str: string): string
	/**
	 * Fills the matrix with "zero" emojis.
	 */
	generateEmptyMatrix(): void
	/**
	 * Plants mines in the matrix randomly.
	 */
	plantMines(): void
	/**
	 * Gets the number of mines in a particular (x, y) coordinate
	 * of the matrix.
	 * @param {number} x - The x coordinate (row).
	 * @param {number} y - The y coordinate (column).
	 * @returns {string}
	 */
	getNumberOfMines(x: number, y: number): string
	/**
	 * Returns the Discord message equivalent of the mine field.
	 * @returns {string}
	 */
	getTextRepresentation(): string
	/**
	 * Populates the matrix.
	 */
	populate(): void
	/**
	 * Reveal a random cell.
	 * @returns {SafeCell}
	 */
	revealFirst(): SafeCell
	/**
	 * Reveals all cells surrounding a cell. Only meant to be used for zero-cells during initial construction.
	 * @param {SafeCell} c - A SafeCell to reveal around. This should only be a zero-cell!
	 * @param {boolean} recurse - Whether to recursively reveal following zero-cells. Defaults to true.
	 */
	revealSurroundings(c: SafeCell, recurse?: boolean): void
	/**
	 * Generates a minesweeper mine field and returns it.
	 * @returns {(string | string[][] | null)}
	 */
	start(): string | string[][] | null
}
export = Minesweeper
