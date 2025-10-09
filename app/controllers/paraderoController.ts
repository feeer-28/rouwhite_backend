import type { HttpContext } from '@adonisjs/core/http'
import Paradero from '#models/paradero'
import Barrio from '#models/barrio'
import Ruta from '#models/ruta'

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
      const body = request.all()
      const nombre: string | undefined = body.nombre
      const direccion: string | null | undefined = body.direccion ?? null
      const latitud: number | null | undefined = body.latitud ?? null
      const longitud: number | null | undefined = body.longitud ?? null
      const barrioId: number | null | undefined = (body.barrioId ?? body.barrio_id) ?? null

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
      const body = request.all()
      const payload: any = {
        nombre: body.nombre,
        direccion: body.direccion,
        latitud: body.latitud,
        longitud: body.longitud,
        barrioId: body.barrioId ?? body.barrio_id,
      }

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

  // Listar rutas que pasan por un paradero específico
  public async rutas({ params, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (!Number.isFinite(id)) return response.badRequest({ message: 'Id inválido' })

      const paradero = await Paradero.find(id)
      if (!paradero) return response.notFound({ message: 'Paradero no encontrado' })

      const rutas = await Ruta.query()
        .join('ruta_paraderos', 'ruta_paraderos.ruta_id', 'rutas.id_ruta')
        .where('ruta_paraderos.paradero_id', id)
        .distinct('rutas.id_ruta')
        .select('rutas.*')
        .preload('empresa')

      if (rutas.length === 0) {
        return response.ok({ message: 'No se encontraron rutas para este paradero', rutas: [] })
      }

      return response.ok({ rutas, total: rutas.length })
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar rutas por paradero', error: String(error) })
    }
  }
}

