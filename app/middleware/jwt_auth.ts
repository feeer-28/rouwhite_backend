import type { HttpContext } from '@adonisjs/core/http'
import type { NextFn } from '@adonisjs/core/types/http'
import env from '#start/env'
import jwt from 'jsonwebtoken'
import User from '#models/user'

export default class JwtAuthMiddleware {
  public async handle(ctx: HttpContext, next: NextFn) {
    const { request, response } = ctx
    try {
      const authHeader = request.header('authorization') || request.header('Authorization')
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return response.unauthorized({ message: 'Token Bearer requerido' })
      }

      const token = authHeader.substring('Bearer '.length).trim()
      const secret = env.get('JWT_SECRET') || env.get('APP_KEY')
      const decoded = jwt.verify(token, secret)
      const payload: jwt.JwtPayload = typeof decoded === 'string' ? { sub: decoded } : decoded

      // Opcional: cargar usuario y exponerlo en el contexto
      let userId: number | null = null
      if (typeof payload.sub === 'number') {
        userId = payload.sub
      } else if (typeof payload.sub === 'string') {
        const parsed = Number.parseInt(payload.sub, 10)
        userId = Number.isFinite(parsed) ? parsed : null
      }
      if (!userId) {
        return response.unauthorized({ message: 'Token inválido: sin subject' })
      }

      const user = await User.find(userId)
      if (!user) {
        return response.unauthorized({ message: 'Usuario no encontrado' })
      }

      // Exponer datos en el contexto de la request
      ;(request as any).jwtPayload = payload
      ;(ctx as any).authUser = user

      await next()
    } catch (error) {
      return response.unauthorized({ message: 'Token inválido o expirado', error: String(error) })
    }
  }
}
