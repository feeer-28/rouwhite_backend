import type { HttpContext } from '@adonisjs/core/http'
import Paradero from '#models/paradero'
import Barrio from '#models/barrio'

export default class ParaderoController {
  // Listar paraderos con paginación y búsqueda por nombre
  public async index({ request, response }: HttpContext) {
    try {
      const { page = 1, perPage = 10, q } = request.qs()
      const query = Paradero.query().preload('barrio')

      if (q) {
        query.whereILike('nombre', `%${q}%`)
      }

      const result = await query.paginate(Number(page), Number(perPage))
      return response.ok(result)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar paraderos', error: String(error) })
    }
  }

  // Obtener paradero por ID
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const paradero = await Paradero.query().where('idParadero', id).preload('barrio').first()
      if (!paradero) {
        return response.notFound({ message: 'Paradero no encontrado' })
      }
      return response.ok(paradero)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener paradero', error: String(error) })
    }
  }

  // Crear paradero
  public async store({ request, response }: HttpContext) {
    try {
      const { nombre, direccion, latitud, longitud, barrioId } = request.only([
        'nombre',
        'direccion',
        'latitud',
        'longitud',
        'barrioId',
      ])

      if (!nombre) {
        return response.badRequest({ message: 'nombre es requerido' })
      }

      if (barrioId) {
        const barrio = await Barrio.find(barrioId)
        if (!barrio) {
          return response.badRequest({ message: 'barrioId inválido' })
        }
      }

      const exists = await Paradero.query().where('nombre', nombre).first()
      if (exists) {
        return response.conflict({ message: 'El paradero ya existe' })
      }

      const paradero = await Paradero.create({ nombre, direccion, latitud, longitud, barrioId: barrioId ?? null })
      return response.created({ message: 'Paradero creado correctamente', paradero })
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear paradero', error: String(error) })
    }
  }

  // Actualizar paradero
  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const payload = request.only(['nombre', 'direccion', 'latitud', 'longitud', 'barrioId'])

      const paradero = await Paradero.find(id)
      if (!paradero) {
        return response.notFound({ message: 'Paradero no encontrado' })
      }

      if (payload.nombre && payload.nombre !== paradero.nombre) {
        const nameExists = await Paradero.query().where('nombre', payload.nombre).andWhereNot('idParadero', id).first()
        if (nameExists) {
          return response.conflict({ message: 'El nombre de paradero ya está en uso' })
        }
      }

      if (payload.barrioId) {
        const barrio = await Barrio.find(payload.barrioId)
        if (!barrio) {
          return response.badRequest({ message: 'barrioId inválido' })
        }
      }

      paradero.merge({
        nombre: payload.nombre ?? paradero.nombre,
        direccion: payload.direccion ?? paradero.direccion,
        latitud: payload.latitud ?? paradero.latitud,
        longitud: payload.longitud ?? paradero.longitud,
        barrioId: payload.barrioId ?? paradero.barrioId,
      })
      await paradero.save()

      return response.ok({ message: 'Paradero actualizado', paradero })
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar paradero', error: String(error) })
    }
  }

  // Eliminar paradero
  public async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params
      const paradero = await Paradero.find(id)
      if (!paradero) {
        return response.notFound({ message: 'Paradero no encontrado' })
      }

      await paradero.delete()
      return response.ok({ message: 'Paradero eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar paradero', error: String(error) })
    }
  }
}

