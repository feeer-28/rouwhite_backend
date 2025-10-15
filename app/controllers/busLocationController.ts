import type { HttpContext } from '@adonisjs/core/http'
import vine from '@vinejs/vine'
import Bus from '#models/bus'
import Role, { RolTipo } from '#models/role'
import busLocationStore from '#services/bus_location_store'

export default class BusLocationController {
  // POST /api/bus/ubicacion
  public async update({ request, response }: HttpContext) {
    try {
      const schema = vine.object({
        idBus: vine.number().positive(),
        latitud: vine.number().min(-90).max(90),
        longitud: vine.number().min(-180).max(180),
      })
      const { idBus, latitud, longitud } = await vine.validate({ schema, data: request.all() })

      const bus = await Bus.find(idBus)
      if (!bus) return response.badRequest({ message: 'idBus inválido: bus no existe' })
      if (bus.estado === false) return response.badRequest({ message: 'Bus inactivo' })

      busLocationStore.set(idBus, latitud, longitud)

      return response.ok({ message: 'Ubicación actualizada', idBus, latitud, longitud })
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar ubicación', error: String(error) })
    }
  }

  // GET /api/bus/ubicacion/:idBus (solo despachador)
  public async current(ctx: HttpContext) {
    const { params, response } = ctx
    try {
      const idBus = Number(params.idBus)
      if (!Number.isFinite(idBus) || idBus <= 0) return response.badRequest({ message: 'idBus inválido' })

      // Seguridad: solo DESPACHADOR
      const authUser = (ctx as any).authUser
      if (!authUser) return response.unauthorized({ message: 'No autenticado' })

      const role = await Role.find(authUser.rolId)
      if (!role || role.nombreRol !== RolTipo.DESPACHADOR) {
        return response.forbidden({ message: 'Acceso restringido a despachadores' })
      }

      const bus = await Bus.find(idBus)
      if (!bus) return response.notFound({ message: 'Bus no encontrado' })
      if (bus.estado === false) return response.badRequest({ message: 'Bus inactivo' })

      const loc = busLocationStore.get(idBus)
      if (!loc) return response.notFound({ message: 'Ubicación no disponible' })

      return response.ok({ idBus, ...loc })
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener ubicación', error: String(error) })
    }
  }

  // GET /api/bus/ubicacion/:idBus/stream (SSE, solo despachador)
  public async stream(ctx: HttpContext) {
    const { params, response } = ctx
    try {
      const idBus = Number(params.idBus)
      if (!Number.isFinite(idBus) || idBus <= 0) return response.badRequest({ message: 'idBus inválido' })

      // Seguridad: solo DESPACHADOR
      const authUser = (ctx as any).authUser
      if (!authUser) return response.unauthorized({ message: 'No autenticado' })

      const role = await Role.find(authUser.rolId)
      if (!role || role.nombreRol !== RolTipo.DESPACHADOR) {
        return response.forbidden({ message: 'Acceso restringido a despachadores' })
      }

      const bus = await Bus.find(idBus)
      if (!bus) return response.notFound({ message: 'Bus no encontrado' })
      if (bus.estado === false) return response.badRequest({ message: 'Bus inactivo' })

      // Configurar SSE
      response.response.setHeader('Content-Type', 'text/event-stream')
      response.response.setHeader('Cache-Control', 'no-cache, no-transform')
      response.response.setHeader('Connection', 'keep-alive')
      // CORS headers si fuese necesario (opcional)
      // response.response.setHeader('Access-Control-Allow-Origin', '*')

      const write = (data: any) => {
        response.response.write(`data: ${JSON.stringify(data)}\n\n`)
      }

      // Enviar última ubicación (si existe)
      const last = busLocationStore.get(idBus)
      if (last) write({ idBus, ...last })

      // Suscribir y emitir cambios
      const unsubscribe = busLocationStore.onLocation(idBus, (loc) => write({ idBus, ...loc }))

      // Cerrar cuando el cliente desconecte
      requestOnceClose(ctx, unsubscribe)
    } catch (error) {
      return response.internalServerError({ message: 'Error en stream de ubicación', error: String(error) })
    }
  }
  
  // GET /public/bus/ubicacion/:idBus (público, solo lectura)
  public async publicCurrent(ctx: HttpContext) {
    const { params, response } = ctx
    try {
      const idBus = Number(params.idBus)
      if (!Number.isFinite(idBus) || idBus <= 0) return response.badRequest({ message: 'idBus inválido' })

      const bus = await Bus.find(idBus)
      if (!bus) return response.notFound({ message: 'Bus no encontrado' })
      if (bus.estado === false) return response.badRequest({ message: 'Bus inactivo' })

      const loc = busLocationStore.get(idBus)
      if (!loc) return response.notFound({ message: 'Ubicación no disponible' })

      return response.ok({ idBus, ...loc })
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener ubicación pública', error: String(error) })
    }
  }

  // GET /public/bus/ubicacion/:idBus/stream (SSE público, solo lectura)
  public async publicStream(ctx: HttpContext) {
    const { params, response } = ctx
    try {
      const idBus = Number(params.idBus)
      if (!Number.isFinite(idBus) || idBus <= 0) return response.badRequest({ message: 'idBus inválido' })

      const bus = await Bus.find(idBus)
      if (!bus) return response.notFound({ message: 'Bus no encontrado' })
      if (bus.estado === false) return response.badRequest({ message: 'Bus inactivo' })

      // Configurar SSE
      response.response.setHeader('Content-Type', 'text/event-stream')
      response.response.setHeader('Cache-Control', 'no-cache, no-transform')
      response.response.setHeader('Connection', 'keep-alive')

      const write = (data: any) => {
        response.response.write(`data: ${JSON.stringify(data)}\n\n`)
      }

      const last = busLocationStore.get(idBus)
      if (last) write({ idBus, ...last })

      const unsubscribe = busLocationStore.onLocation(idBus, (loc) => write({ idBus, ...loc }))
      requestOnceClose(ctx, unsubscribe)
    } catch (error) {
      return response.internalServerError({ message: 'Error en stream público de ubicación', error: String(error) })
    }
  }
}

// Utilidad: desuscribir cuando la conexión se cierra
function requestOnceClose(ctx: HttpContext, onClose: () => void) {
  const req = ctx.request.request
  const res = ctx.response.response
  const cleanup = () => {
    try { onClose() } catch {}
    try { res.end() } catch {}
  }
  req.on('close', cleanup)
  req.on('aborted', cleanup)
}
