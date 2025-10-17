import type { HttpContext } from '@adonisjs/core/http'
import Bus from '#models/bus'
import Empresa from '#models/empresa'
import Ruta from '#models/ruta'
import busLocationStore from '#services/bus_location_store'

export default class BusController {
  // Listar buses con paginación y búsqueda por placa
  public async index({ request, response }: HttpContext) {
    try {
      const { page = 1, perPage = 10, q, empresaId, empresa_id } = request.qs()
      const query = Bus.query().preload('empresa').preload('ruta')

      const jwtEmpresaId = (request as any)?.jwtPayload?.empresaId
      const empId = Number(empresaId ?? empresa_id ?? jwtEmpresaId)
      if (Number.isFinite(empId)) {
        query.where('empresa_id', empId)
      }

      if (q) {
        query.whereILike('placa', `%${q}%`)
      }

      const result = await query.paginate(Number(page), Number(perPage))
      return response.ok(result)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar buses', error: String(error) })
    }
  }

  // Obtener bus por ID
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const bus = await Bus.query().where('idBus', id).preload('empresa').preload('ruta').first()
      if (!bus) {
        return response.notFound({ message: 'Bus no encontrado' })
      }
      return response.ok(bus)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener bus', error: String(error) })
    }
  }

  // Crear bus
  public async store({ request, response }: HttpContext) {
    try {
      const body = request.all()
      const placa: string | undefined = body.placa
      const descripcion: string | null | undefined = body.descripcion ?? null
      const empresaId: number | undefined = body.empresaId ?? body.empresa_id
      const rutaId: number | undefined = body.rutaId ?? body.ruta_id
      const latitud: number | null | undefined = body.latitud ?? null
      const longitud: number | null | undefined = body.longitud ?? null
      const estado: boolean | undefined = typeof body.estado === 'boolean' ? body.estado : undefined

      if (!placa || !empresaId || !rutaId) {
        return response.badRequest({ message: 'placa, empresaId y rutaId son requeridos' })
      }

      const empresa = await Empresa.find(empresaId)
      if (!empresa) {
        return response.badRequest({ message: 'empresaId inválido' })
      }

      const ruta = await Ruta.find(rutaId)
      if (!ruta) {
        return response.badRequest({ message: 'rutaId inválido' })
      }

      const exists = await Bus.query().where('placa', placa).first()
      if (exists) {
        return response.conflict({ message: 'Ya existe un bus con esa placa' })
      }

      const bus = await Bus.create({ placa, descripcion, empresaId, rutaId, latitud, longitud, estado })
      return response.created({ message: 'Bus creado correctamente', bus })
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear bus', error: String(error) })
    }
  }

  // Actualizar bus
  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const body = request.all()
      const payload: any = {
        placa: body.placa,
        descripcion: body.descripcion,
        empresaId: body.empresaId ?? body.empresa_id,
        rutaId: body.rutaId ?? body.ruta_id,
        latitud: body.latitud,
        longitud: body.longitud,
        estado: (typeof body.estado === 'boolean' ? body.estado : undefined),
      }

      const bus = await Bus.find(id)
      if (!bus) {
        return response.notFound({ message: 'Bus no encontrado' })
      }

      if (payload.empresaId) {
        const empresa = await Empresa.find(payload.empresaId)
        if (!empresa) {
          return response.badRequest({ message: 'empresaId inválido' })
        }
      }

      if (payload.rutaId) {
        const ruta = await Ruta.find(payload.rutaId)
        if (!ruta) {
          return response.badRequest({ message: 'rutaId inválido' })
        }
      }

      if (payload.placa && payload.placa !== bus.placa) {
        const dup = await Bus.query().where('placa', payload.placa).andWhereNot('idBus', id).first()
        if (dup) {
          return response.conflict({ message: 'Ya existe un bus con esa placa' })
        }
      }

      bus.merge({
        placa: payload.placa ?? bus.placa,
        descripcion: payload.descripcion ?? bus.descripcion,
        empresaId: payload.empresaId ?? bus.empresaId,
        rutaId: payload.rutaId ?? bus.rutaId,
        latitud: payload.latitud ?? bus.latitud,
        longitud: payload.longitud ?? bus.longitud,
        estado: payload.estado ?? bus.estado,
      })
      await bus.save()

      return response.ok({ message: 'Bus actualizado', bus })
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar bus', error: String(error) })
    }
  }

  // Eliminar bus
  public async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params
      const bus = await Bus.find(id)
      if (!bus) {
        return response.notFound({ message: 'Bus no encontrado' })
      }
      await bus.delete()
      return response.ok({ message: 'Bus eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar bus', error: String(error) })
    }
  }

  // Activar bus
  public async activate({ params, response }: HttpContext) {
    try {
      const { id } = params
      const bus = await Bus.find(id)
      if (!bus) return response.notFound({ message: 'Bus no encontrado' })
      bus.estado = true
      await bus.save()
      return response.ok({ message: 'Bus activado', bus })
    } catch (error) {
      return response.internalServerError({ message: 'Error al activar bus', error: String(error) })
    }
  }

  // Desactivar bus
  public async deactivate({ params, response }: HttpContext) {
    try {
      const { id } = params
      const bus = await Bus.find(id)
      if (!bus) return response.notFound({ message: 'Bus no encontrado' })
      bus.estado = false
      await bus.save()
      return response.ok({ message: 'Bus desactivado', bus })
    } catch (error) {
      return response.internalServerError({ message: 'Error al desactivar bus', error: String(error) })
    }
  }

  // Actualizar ubicación del bus (simular que un dispositivo envía coordenadas)
  // PUT /api/buses/:id/ubicacion
  public async updateLocation({ params, request, response }: HttpContext) {
    try {
      const id = Number(params.id)
      if (!Number.isFinite(id) || id <= 0) {
        return response.badRequest({ message: 'Id de bus inválido' })
      }

      const { latitud, longitud } = request.only(['latitud', 'longitud']) as {
        latitud?: number
        longitud?: number
      }

      if (typeof latitud !== 'number' || latitud < -90 || latitud > 90) {
        return response.badRequest({ message: 'latitud inválida (-90 a 90)' })
      }
      if (typeof longitud !== 'number' || longitud < -180 || longitud > 180) {
        return response.badRequest({ message: 'longitud inválida (-180 a 180)' })
      }

      const bus = await Bus.find(id)
      if (!bus) return response.notFound({ message: 'Bus no encontrado' })
      if (bus.estado === false) return response.badRequest({ message: 'Bus inactivo' })

      busLocationStore.set(id, latitud, longitud)

      return response.ok({ message: 'Ubicación actualizada', idBus: id, latitud, longitud })
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar ubicación del bus', error: String(error) })
    }
  }
}

