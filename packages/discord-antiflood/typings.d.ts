declare module 'src/index' {
	declare function _exports(
		client: any,
		antifloodAjustes: {
			debug: boolean
			ignorarBots: boolean
			usuariosIgnorados: string[]
			servidoresIgnorados: string[]
			canalesIgnorados: string[]
			permisosIgnorados: string[]
			infracciones: Array<{ id: string; mensajes: number; args: any }>
		}
	): Promise<any>
}
