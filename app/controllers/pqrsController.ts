import type { HttpContext } from '@adonisjs/core/http'
import Pqrs from '#models/pqrs'
import vine from '@vinejs/vine'

export default class PqrsController {
  public async index({ request, response }: HttpContext) {
    try {
      const querySchema = vine.object({
        usuarioId: vine.number().positive().optional(),
        empresaId: vine.number().positive().optional(),
      })

      const raw = request.qs()
      const jwtEmpresaId = (request as any)?.jwtPayload?.empresaId
      const normalized = {
        ...raw,
        empresaId: raw.empresaId ?? raw.empresa_id ?? jwtEmpresaId,
      }
      const { usuarioId, empresaId } = await vine.validate({ schema: querySchema, data: normalized })

      const q = Pqrs.query().preload('usuario').preload('empresa').orderBy('idPQRS', 'desc')
      if (usuarioId) q.where('usuarioId', usuarioId)
      if (empresaId) q.where('empresaId', empresaId)

      const items = await q
      return response.ok(items)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar PQRS', error: String(error) })
    }
  }

  public async show({ params, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (!Number.isFinite(id)) return response.badRequest({ message: 'Id inválido' })

      const item = await Pqrs.query().where('idPQRS', id).preload('usuario').preload('empresa').first()
      if (!item) return response.notFound({ message: 'PQRS no encontrado' })

      return response.ok(item)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener PQRS', error: String(error) })
    }
  }

  public async store(ctx: HttpContext) {
    const { request, response } = ctx
    try {
      // Nota: Para pruebas sin middleware JWT, permitimos usuarioId en el body cuando no hay usuario autenticado
      const schema = vine.object({
        empresaId: vine.number().positive(),
        asunto: vine.string().trim().maxLength(150),
        mensaje: vine.string().trim().minLength(1),
        usuarioId: vine.number().positive().optional(),
      })
      const raw = request.all()
      const normalized = {
        ...raw,
        empresaId: raw.empresaId ?? raw.empresa_id,
      }
      const payload = await vine.validate({ schema, data: normalized })

      // Tomar el usuario autenticado del middleware JWT
      const authUser = (ctx as any).authUser
      // Si no hay usuario autenticado, permitir que llegue usuarioId en el body (solo para pruebas)
      const resolvedUsuarioId = authUser?.idUsuario ?? payload.usuarioId
      if (!resolvedUsuarioId) {
        return response.badRequest({
          message: 'usuarioId es requerido cuando no está autenticado',
        })
      }

      const pqrs = await Pqrs.create({
        usuarioId: resolvedUsuarioId,
        empresaId: payload.empresaId,
        asunto: payload.asunto,
        mensaje: payload.mensaje,
      })

      await pqrs.load('usuario')
      await pqrs.load('empresa')

      return response.created({ message: 'PQRS creada', pqrs })
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear PQRS', error: String(error) })
    }
  }

  public async destroy({ params, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (!Number.isFinite(id)) return response.badRequest({ message: 'Id inválido' })

      const item = await Pqrs.find(id)
      if (!item) return response.notFound({ message: 'PQRS no encontrado' })

      await item.delete()
      return response.ok({ message: 'PQRS eliminada' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar PQRS', error: String(error) })
    }
  }
}
