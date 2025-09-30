import vine from '@vinejs/vine'

export const loginValidator = vine.compile(
  vine.object({
    email: vine.string().email(),
    password: vine.string().minLength(8).maxLength(32),
  })
)

export const registerValidator = vine.compile(
  vine.object({
    nombre: vine.string().minLength(3).maxLength(64),
    apellido: vine.string().minLength(3).maxLength(64),
    email: vine
      .string()
      .email()
      .unique(async (db, value) => {
        const usuario = await db.from('usuarios').where('email', value).first()
        return !usuario
      }),
    password: vine.string().minLength(12).maxLength(512),
    avatarUrl: vine.string().optional(),
  })
)
