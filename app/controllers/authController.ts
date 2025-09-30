import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import jwt from 'jsonwebtoken'
import hash from '@adonisjs/core/services/hash'
import User from '#models/user'
import Role from '#models/role'
import vine from '@vinejs/vine'

export default class AuthController {
  public async register({ request, response }: HttpContext) {
    try {
      // Validación con Vine
      const registerSchema = vine.object({
        nombre: vine.string().trim().minLength(2).maxLength(64),
        apellido: vine.string().trim().minLength(2).maxLength(64),
        email: vine.string().trim().toLowerCase().email(),
        password: vine.string().minLength(6).maxLength(128),
        identificacion: vine.string().trim().minLength(3).maxLength(64),
        rolId: vine.number().positive(),
        empresaId: vine.number().positive().optional(),
      })
      const payload = await vine.validate({ schema: registerSchema, data: request.all() })

      // Normalizar email
      const emailNormalized = payload.email

      // Validar unicidad de email
      const exists = await User.query().where('email', emailNormalized).first()
      if (exists) return response.conflict({ message: 'El email ya está registrado' })

      // Validar rol existente (opcional, pero útil)
      const role = await Role.find(payload.rolId)
      if (!role) return response.badRequest({ message: 'rolId inválido' })

      // IMPORTANTE: No hashear manualmente aquí. El modelo User usa withAuthFinder y hashea automáticamente.
      const user = await User.create({
        nombre: payload.nombre,
        apellido: payload.apellido,
        email: emailNormalized,
        password: String(payload.password),
        identificacion: payload.identificacion,
        rolId: payload.rolId,
        empresaId: payload.empresaId ?? null,
        estado: true,
      })

      return response.created({
        message: 'Usuario registrado correctamente',
        user: {
          idUsuario: user.idUsuario,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          identificacion: user.identificacion,
          rolId: user.rolId,
          empresaId: user.empresaId,
        },
      })
    } catch (error) {
      return response.internalServerError({ message: 'Error al registrar usuario', error: String(error) })
    }
  }

  public async login({ request, response }: HttpContext) {
    try {
      // Validación con Vine
      const loginSchema = vine.object({
        email: vine.string().trim().toLowerCase().email(),
        password: vine.string().minLength(6).maxLength(128),
      })
      const { email, password } = await vine.validate({ schema: loginSchema, data: request.all() })

      const emailNormalized = email
      const user = await User.query().where('email', emailNormalized).first()
      if (!user) return response.unauthorized({ message: 'Credenciales inválidas' })
      if (user.estado === false) return response.unauthorized({ message: 'Usuario desactivado' })
      // Verificar primero con bcrypt (hashes nuevos), luego con scrypt (compatibilidad)
      const plain = String(password)
      let valid = await hash.use('bcrypt').verify(user.password, plain)
      if (!valid) valid = await hash.use('scrypt').verify(user.password, plain)
      if (!valid) return response.unauthorized({ message: 'Credenciales inválidas' })

      const secret = env.get('JWT_SECRET') || env.get('APP_KEY')
      const token = jwt.sign(
        {
          sub: user.idUsuario,
          email: user.email,
          rolId: user.rolId,
        },
        secret,
        { expiresIn: '1d' }
      )

      return response.ok({
        message: 'Login exitoso',
        token,
        user: {
          idUsuario: user.idUsuario,
          nombre: user.nombre,
          apellido: user.apellido,
          email: user.email,
          identificacion: user.identificacion,
          rolId: user.rolId,
          empresaId: user.empresaId,
        },
      })
    } catch (error) {
      return response.internalServerError({ message: 'Error al iniciar sesión', error: String(error) })
    }
  }

  public async logout({ response }: HttpContext) {
    try {
      // Con JWT stateless no hay invalidación en servidor a menos que se implemente un blacklist.
      // El cliente debe descartar el token.
      return response.ok({ message: 'Logout exitoso' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al cerrar sesión', error: String(error) })
    }
  }
}

