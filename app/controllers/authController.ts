import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'
import jwt from 'jsonwebtoken'
import logger from '@adonisjs/core/services/logger'
import User from '#models/user'
import Role from '#models/role'
import { RolTipo } from '#models/role'
import { registerUsuarioValidator, registerAdminValidator, loginValidator } from '#validators/auth'

//este solo es un comentario 

export default class AuthController {
  // Registro de USUARIO COMÚN: rol fijo USUARIO
  public async registerUsuario({ request, response }: HttpContext) {
    try {
      const payload = await registerUsuarioValidator.validate(request.all())
      const email = payload.email.trim().toLowerCase()

      const exists = await User.query().where('email', email).first()
      if (exists) return response.conflict({ message: 'El email ya está registrado' })

      const rol = await Role.query().where('nombre_rol', RolTipo.USUARIO).first()
      if (!rol) return response.internalServerError({ message: 'Rol USUARIO no configurado' })

      const passwordPlain = String(payload.password)
      const user = await User.create({
        nombre: payload.nombre,
        apellido: payload.apellido,
        email,
        password: passwordPlain,
        identificacion: payload.identificacion,
        rolId: rol.idRol,
        empresaId: null,
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

  // Registro de ADMIN: rol fijo ADMIN, empresaId opcional
  public async registerAdmin({ request, response }: HttpContext) {
    try {
      const payload = await registerAdminValidator.validate(request.all())
      const email = payload.email.trim().toLowerCase()

      const exists = await User.query().where('email', email).first()
      if (exists) return response.conflict({ message: 'El email ya está registrado' })

      const rol = await Role.query().where('nombre_rol', RolTipo.ADMIN).first()
      if (!rol) return response.internalServerError({ message: 'Rol ADMIN no configurado' })

      const passwordPlain = String(payload.password)
      const user = await User.create({
        nombre: payload.nombre,
        apellido: payload.apellido,
        email,
        password: passwordPlain,
        identificacion: payload.identificacion,
        rolId: rol.idRol,
        empresaId: null,
      })

      return response.created({
        message: 'Admin registrado correctamente',
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
      return response.internalServerError({ message: 'Error al registrar admin', error: String(error) })
    }
  }

  public async login({ request, response }: HttpContext) {
    try {
      const { email, password } = await loginValidator.validate(request.all())

      const emailNormalized = email.trim().toLowerCase()
      logger.info('[AUTH][LOGIN] emailNormalized: %s', emailNormalized)
      const user = await User.query().where('email', emailNormalized).first()
      logger.info('[AUTH][LOGIN] userFound: %s', !!user)
      if (!user) return response.unauthorized({ message: 'Credenciales inválidas' })

      const plain = String(password)
      const stored = String(user.password || '')
      const valid = stored === plain

      if (!valid) return response.unauthorized({ message: 'Credenciales inválidas' })

      const secret = env.get('JWT_SECRET') || env.get('APP_KEY')
      const token = jwt.sign(
        {
          sub: user.idUsuario,
          email: user.email,
          rolId: user.rolId,
          empresaId: user.empresaId,
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


