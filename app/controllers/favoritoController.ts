import type { HttpContext } from '@adonisjs/core/http'
import Favorito from '#models/favorito'
import Ruta from '#models/ruta'
import User from '#models/user'

export default class FavoritoController {
  // Listar favoritos del usuario autenticado
  public async index({ request, response }: HttpContext) {
    try {
      const authUser = (request as any).authUser as { idUsuario: number } | undefined
      const qs = request.qs() as any
      const usuarioIdRaw = authUser?.idUsuario ?? qs.usuarioId ?? qs.usuario_id
      const usuarioId = Number(usuarioIdRaw)
      if (!Number.isFinite(usuarioId) || usuarioId <= 0) {
        return response.badRequest({ message: 'usuarioId es requerido y debe ser un número positivo' })
      }

      const favoritos = await Favorito.query()
        .where('usuario_id', usuarioId)
        .preload('ruta')

      return response.ok(favoritos)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar favoritos', error: String(error) })
    }
  }

  // Agregar una ruta a favoritos del usuario autenticado
  public async store({ request, response }: HttpContext) {
    try {
      const authUser = (request as any).authUser as { idUsuario: number } | undefined
      const body = request.all()

      const rutaId: number | undefined = body.rutaId ?? body.ruta_id
      if (!rutaId) return response.badRequest({ message: 'rutaId es requerido' })

      // Determinar usuarioId: del JWT si existe, o del body como fallback público
      const usuarioIdRaw = authUser?.idUsuario ?? body.usuarioId ?? body.usuario_id
      const usuarioId = Number(usuarioIdRaw)
      if (!Number.isFinite(usuarioId) || usuarioId <= 0) {
        return response.badRequest({ message: 'usuarioId es requerido y debe ser un número positivo' })
      }

      // Validar existencia de usuario y ruta
      const [usuario, ruta] = await Promise.all([User.find(usuarioId), Ruta.find(rutaId)])
      if (!usuario) return response.badRequest({ message: 'usuarioId inválido' })
      if (!ruta) return response.badRequest({ message: 'rutaId inválido' })

      // Evitar duplicado
      const exists = await Favorito.query().where('usuario_id', usuarioId).andWhere('ruta_id', rutaId).first()
      if (exists) return response.conflict({ message: 'La ruta ya está en favoritos' })

      const favorito = await Favorito.create({ usuarioId, rutaId })
      return response.created({ message: 'Agregado a favoritos', favorito })
    } catch (error) {
      return response.internalServerError({ message: 'Error al agregar favorito', error: String(error) })
    }
  }

  // Eliminar un favorito por id
  public async destroy({ params, request, response }: HttpContext) {
    try {
      const authUser = (request as any).authUser as { idUsuario: number } | undefined
      const body = request.all()
      const qs = request.qs() as any
      const usuarioIdRaw = authUser?.idUsuario ?? body.usuarioId ?? body.usuario_id ?? qs.usuarioId ?? qs.usuario_id
      const usuarioId = Number(usuarioIdRaw)
      if (!Number.isFinite(usuarioId) || usuarioId <= 0) {
        return response.badRequest({ message: 'usuarioId es requerido y debe ser un número positivo' })
      }

      const { id } = params
      const favorito = await Favorito.query()
        .where('id_favorito', id)
        .andWhere('usuario_id', usuarioId)
        .first()

      if (!favorito) return response.notFound({ message: 'Favorito no encontrado' })

      await favorito.delete()
      return response.ok({ message: 'Favorito eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar favorito', error: String(error) })
    }
  }
}

