import type { HttpContext } from '@adonisjs/core/http'
import Ruta from '#models/ruta'
import Empresa from '#models/empresa'

export default class RutaController {
  // Listar rutas con búsqueda por nombre_ruta
  public async index({ request, response }: HttpContext) {
    try {
      const { q } = request.qs()
      const query = Ruta.query().preload('empresa')

      if (q) {
        query.whereILike('nombre_ruta', `%${q}%`)
      }

      const result = await query
      return response.ok(result)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar rutas', error: String(error) })
    }
  }

  // Obtener ruta por ID con paraderos (ordenados por pivot.orden)
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const ruta = await Ruta.query()
        .where('id_ruta', id)
        .preload('empresa')
        .preload('paraderos', (p) => {
          p.pivotColumns(['orden', 'tipo']).orderBy('ruta_paraderos.orden', 'asc')
        })
        .first()
      if (!ruta) {
        return response.notFound({ message: 'Ruta no encontrada' })
      }
      return response.ok(ruta)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener ruta', error: String(error) })
    }
  }

  // Crear ruta
  public async store({ request, response }: HttpContext) {
    try {
      const { nombreRuta, empresaId } = request.only(['nombreRuta', 'empresaId'])

      if (!nombreRuta || !empresaId) {
        return response.badRequest({ message: 'nombreRuta y empresaId son requeridos' })
      }

      const empresa = await Empresa.find(empresaId)
      if (!empresa) {
        return response.badRequest({ message: 'empresaId inválido' })
      }

      const exists = await Ruta.query()
        .where('nombre_ruta', nombreRuta)
        .andWhere('empresa_id', empresaId)
        .first()
      if (exists) {
        return response.conflict({ message: 'La ruta ya existe para esta empresa' })
      }

      const ruta = await Ruta.create({ nombreRuta, empresaId })
      return response.created({ message: 'Ruta creada correctamente', ruta })
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear ruta', error: String(error) })
    }
  }

  // Actualizar ruta
  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const payload = request.only(['nombreRuta', 'empresaId'])

      const ruta = await Ruta.find(id)
      if (!ruta) {
        return response.notFound({ message: 'Ruta no encontrada' })
      }

      if (payload.empresaId) {
        const empresa = await Empresa.find(payload.empresaId)
        if (!empresa) {
          return response.badRequest({ message: 'empresaId inválido' })
        }
      }

      if (payload.nombreRuta && (payload.nombreRuta !== ruta.nombreRuta || (payload.empresaId && payload.empresaId !== ruta.empresaId))) {
        const dup = await Ruta.query()
          .where('nombre_ruta', payload.nombreRuta)
          .andWhere('empresa_id', payload.empresaId ?? ruta.empresaId)
          .andWhereNot('id_ruta', id)
          .first()
        if (dup) {
          return response.conflict({ message: 'Ya existe una ruta con ese nombre en la empresa' })
        }
      }

      ruta.merge({
        nombreRuta: payload.nombreRuta ?? ruta.nombreRuta,
        empresaId: payload.empresaId ?? ruta.empresaId,
      })
      await ruta.save()

      return response.ok({ message: 'Ruta actualizada', ruta })
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar ruta', error: String(error) })
    }
  }

  // Eliminar ruta
  public async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params
      const ruta = await Ruta.find(id)
      if (!ruta) {
        return response.notFound({ message: 'Ruta no encontrada' })
      }
      await ruta.delete()
      return response.ok({ message: 'Ruta eliminada' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar ruta', error: String(error) })
    }
  }
}

