import type { HttpContext } from '@adonisjs/core/http'
import Barrio from '#models/barrio'
import Ruta from '#models/ruta'

export default class BarrioController {
  // Listar barrios con paginación y búsqueda por nombre
  public async index({ request, response }: HttpContext) {
    try {
      const { page = 1, perPage = 10, q } = request.qs()
      const query = Barrio.query()

      if (q) {
        query.whereILike('nombre', `%${q}%`)
      }

      const result = await query.paginate(Number(page), Number(perPage))
      return response.ok(result)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar barrios', error: String(error) })
    }
  }

  // Obtener un barrio por ID
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const barrio = await Barrio.find(id)
      if (!barrio) {
        return response.notFound({ message: 'Barrio no encontrado' })
      }
      return response.ok(barrio)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener barrio', error: String(error) })
    }
  }

  // Crear barrio
  public async store({ request, response }: HttpContext) {
    try {
      const { nombre, latitud, longitud } = request.only(['nombre', 'latitud', 'longitud'])

      if (!nombre) {
        return response.badRequest({ message: 'nombre es requerido' })
      }

      const exists = await Barrio.query().where('nombre', nombre).first()
      if (exists) {
        return response.conflict({ message: 'El barrio ya existe' })
      }

      const barrio = await Barrio.create({ nombre, latitud, longitud })
      return response.created({ message: 'Barrio creado correctamente', barrio })
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear barrio', error: String(error) })
    }
  }

  // Actualizar barrio
  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const payload = request.only(['nombre', 'latitud', 'longitud'])

      const barrio = await Barrio.find(id)
      if (!barrio) {
        return response.notFound({ message: 'Barrio no encontrado' })
      }

      if (payload.nombre && payload.nombre !== barrio.nombre) {
        const nameExists = await Barrio.query().where('nombre', payload.nombre).andWhereNot('idBarrio', id).first()
        if (nameExists) {
          return response.conflict({ message: 'El nombre de barrio ya está en uso' })
        }
      }

      barrio.merge({
        nombre: payload.nombre ?? barrio.nombre,
        latitud: payload.latitud ?? barrio.latitud,
        longitud: payload.longitud ?? barrio.longitud,
      })
      await barrio.save()

      return response.ok({ message: 'Barrio actualizado', barrio })
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar barrio', error: String(error) })
    }
  }

  // Eliminar barrio
  public async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params
      const barrio = await Barrio.find(id)
      if (!barrio) {
        return response.notFound({ message: 'Barrio no encontrado' })
      }

      await barrio.delete()
      return response.ok({ message: 'Barrio eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar barrio', error: String(error) })
    }
  }

  // Listar rutas que pasan por un barrio (por cualquiera de sus paraderos)
  public async rutas({ params, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (!Number.isFinite(id)) return response.badRequest({ message: 'Id inválido' })

      const barrio = await Barrio.find(id)
      if (!barrio) return response.notFound({ message: 'Barrio no encontrado' })

      const rutas = await Ruta.query()
        .join('ruta_paraderos', 'ruta_paraderos.ruta_id', 'rutas.id_ruta')
        .join('paraderos', 'paraderos.id_paradero', 'ruta_paraderos.paradero_id')
        .where('paraderos.barrio_id', id)
        .distinct('rutas.id_ruta')
        .select('rutas.*')
        .preload('empresa')

      if (rutas.length === 0) {
        return response.ok({ message: 'No se encontraron rutas para este barrio', rutas: [] })
      }

      return response.ok({ rutas, total: rutas.length })
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar rutas por barrio', error: String(error) })
    }
  }
}

