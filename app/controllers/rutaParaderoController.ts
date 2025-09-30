import type { HttpContext } from '@adonisjs/core/http'
import RutaParadero, { TipoRuta } from '#models/rutas_paradero'
import Ruta from '#models/ruta'
import Paradero from '#models/paradero'

export default class RutaParaderoController {
  // Listar entradas de la pivot. Se puede filtrar por rutaId (?rutaId=1)
  public async index({ request, response }: HttpContext) {
    try {
      const { rutaId } = request.qs()
      const query = RutaParadero.query().preload('paradero').preload('ruta')
      if (rutaId) {
        query.where('rutaId', Number(rutaId))
      }
      const list = await query.orderBy('orden', 'asc')
      return response.ok(list)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar ruta-paraderos', error: String(error) })
    }
  }

  // Crear entrada en la pivot
  public async store({ request, response }: HttpContext) {
    try {
      const { rutaId, paraderoId, orden, tipo } = request.only(['rutaId', 'paraderoId', 'orden', 'tipo']) as {
        rutaId?: number
        paraderoId?: number
        orden?: number
        tipo?: TipoRuta | string
      }

      if (!rutaId || !paraderoId || typeof orden !== 'number' || orden < 0 || !tipo) {
        return response.badRequest({ message: 'rutaId, paraderoId, orden y tipo son requeridos' })
      }

      const allowed = Object.values(TipoRuta)
      if (!allowed.includes(tipo as TipoRuta)) {
        return response.badRequest({ message: `tipo inválido. Valores permitidos: ${allowed.join(', ')}` })
      }

      const ruta = await Ruta.find(rutaId)
      if (!ruta) return response.badRequest({ message: 'rutaId inválido' })

      const paradero = await Paradero.find(paraderoId)
      if (!paradero) return response.badRequest({ message: 'paraderoId inválido' })

      const dup = await RutaParadero.query().where({ rutaId, paraderoId, tipo }).first()
      if (dup) {
        return response.conflict({ message: 'Ya existe esta relación para el tipo especificado' })
      }

      const rp = await RutaParadero.create({ rutaId, paraderoId, orden, tipo: tipo as TipoRuta })
      return response.created({ message: 'Relación creada', rutaParadero: rp })
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear relación', error: String(error) })
    }
  }

  // Actualizar orden o tipo de una entrada
  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const payload = request.only(['orden', 'tipo']) as { orden?: number; tipo?: TipoRuta | string }

      const rp = await RutaParadero.find(id)
      if (!rp) return response.notFound({ message: 'Relación no encontrada' })

      if (payload.tipo) {
        const allowed = Object.values(TipoRuta)
        if (!allowed.includes(payload.tipo as TipoRuta)) {
          return response.badRequest({ message: `tipo inválido. Valores permitidos: ${allowed.join(', ')}` })
        }
        rp.tipo = payload.tipo as TipoRuta
      }

      if (typeof payload.orden === 'number') {
        if (payload.orden < 0) return response.badRequest({ message: 'orden debe ser >= 0' })
        rp.orden = payload.orden
      }

      await rp.save()
      return response.ok({ message: 'Relación actualizada', rutaParadero: rp })
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar relación', error: String(error) })
    }
  }

  // Eliminar entrada
  public async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params
      const rp = await RutaParadero.find(id)
      if (!rp) return response.notFound({ message: 'Relación no encontrada' })
      await rp.delete()
      return response.ok({ message: 'Relación eliminada' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar relación', error: String(error) })
    }
  }
}

