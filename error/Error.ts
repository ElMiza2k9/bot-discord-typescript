import chalk from 'chalk'

export default {
	error: (msg: string) => {
		console.log(`${chalk.red(`ERR !`)} ${msg}`)
	},

	warn: (msg: string) => {
		console.log(`${chalk.yellow(`WARN !`)} ${msg}`)
	}
}
