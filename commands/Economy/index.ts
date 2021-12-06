import { Command } from '../../interfaces'
import handlehook from '../../error/HandleHook'

export const command: Command = {
	data: {
		name: 'eco',
		description: 'Comandos de economia',
		options: [
			{
				description: 'Mira tu dinero actual 👛',
				name: 'balance',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Elige un usuario 👤',
						name: 'usuario',
						type: 'USER',
						required: false
					}
				]
			},
			{
				description: '(❄️ 10m) Comete un crimen y evita que te atrape la policía 🔫',
				name: 'crimen',
				type: 'SUB_COMMAND'
			},
			{
				description: '(❄️ 5m) Trabaja para ganar dinero 🏢',
				name: 'trabajar',
				type: 'SUB_COMMAND'
			},
			{
				description: '(❄️ 15m) Robale el dinero a un usuario 😡',
				name: 'robar',
				type: 'SUB_COMMAND',
				options: [
					{
						description: '¿A quién robarás? 👤',
						name: 'usuario',
						type: 'USER',
						required: true
					}
				]
			},
			{
				description: 'Configura parametros de la economía ⚙️',
				name: 'set',
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						description: 'Cambia la moneda del servidor 🪙',
						name: 'moneda',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'La nueva moneda 🔧',
								name: 'nuevo',
								type: 'STRING',
								required: true
							}
						]
					}
				]
			},
			{
				description: 'Mira tu inventario 💼',
				name: 'inventario',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'Mira el inventario de otro usuario 👤',
						name: 'usuario',
						type: 'USER'
					},
					{
						description: 'Mira una página específica de la lista 🧾',
						name: 'pagina',
						type: 'INTEGER'
					}
				]
			},
			{
				description: 'Mira la tienda 🛒',
				name: 'tienda',
				type: 'SUB_COMMAND_GROUP',
				options: [
					{
						description: 'Agrega un item a la tienda 👷',
						name: 'agregar',
						type: 'SUB_COMMAND',
						options: [
							{
								description: '(< 30) El nombre del objeto 🃏',
								name: 'nombre',
								type: 'STRING',
								required: true
							},
							{
								description: '(< 300) Una breve descripción del objeto 📖',
								name: 'descripcion',
								type: 'STRING',
								required: true
							},
							{
								description: '(>= 0) El precio del objeto 💰',
								name: 'precio',
								type: 'INTEGER',
								required: true
							},
							{
								description: '¿Quieres otorgar un rol al comprar el objeto? 🎒',
								name: 'rol',
								type: 'ROLE',
								required: false
							},
							{
								description: '¿Quieres que solo ciertas personas puedan comprar el objeto? 🆔',
								name: 'rol-requerido',
								type: 'ROLE',
								required: false
							}
						]
					},
					{
						description: 'Mira las ofertas del admin 👀',
						name: 'ver',
						type: 'SUB_COMMAND'
					},
					{
						description: '¿Te convenció un producto? ¡Pues a comprarlo! 🛒',
						name: 'comprar',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'La ID del producto 🆔',
								name: 'id',
								type: 'STRING',
								required: true
							}
						]
					},
					{
						description: '¿Quieres quitar stock? 👷',
						name: 'remover',
						type: 'SUB_COMMAND',
						options: [
							{
								description: 'La ID del producto 🆔',
								name: 'id',
								type: 'STRING',
								required: true
							}
						]
					}
				]
			},
			{
				description: 'Deposita dinero en el banco 🏦',
				name: 'depositar',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El dinero que quieres depositar 💵',
						name: 'cantidad',
						type: 'INTEGER',
						required: true
					}
				]
			},
			{
				description: 'Retira dinero del banco 🏦',
				name: 'retirar',
				type: 'SUB_COMMAND',
				options: [
					{
						description: 'El dinero que quieres retirar 💵',
						name: 'cantidad',
						type: 'INTEGER',
						required: true
					}
				]
			}
		],
		type: 'CHAT_INPUT'
	},
	do: async (client, interaction) => {
		try {
			const subcommand = interaction.options['_group']
				? interaction.options.getSubcommandGroup()
				: interaction.options.getSubcommand()

			;(await import(`./sub/` + subcommand)).default.do(client, interaction)
		} catch (error) {
			handlehook(error, interaction)
		}
	}
}
