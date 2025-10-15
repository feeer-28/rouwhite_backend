import type { HttpContext } from '@adonisjs/core/http'
import Ruta from '#models/ruta'
import Barrio from '#models/barrio'
import Paradero from '#models/paradero'

export default class SearchController {
  public async search({ request, response }: HttpContext) {
    try {
      const { q, limit = 10 } = request.qs() as any
      const term: string | undefined = typeof q === 'string' ? q.trim() : undefined
      const take = Math.min(Math.max(Number(limit) || 10, 1), 50)

      if (!term || term.length === 0) {
        return response.badRequest({ message: 'Parámetro q es requerido' })
      }

      // Normalizar (eliminar tildes) para búsqueda sin acentos
      const normalized = term
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')

      // Rutas por nombre (pre-carga empresa y paraderos agrupables por tipo)
      const rutasQuery = Ruta.query()
        .where((qb) => {
          qb.whereILike('nombre_ruta', `%${term}%`)
            .orWhereRaw('unaccent(nombre_ruta) ILIKE ?', [`%${normalized}%`])
        })
        .preload('empresa')
        .limit(take)
        .preload('rutaParaderos', (q) => {
          q.orderBy('orden', 'asc').preload('paradero')
        })

      const rutasRaw = await rutasQuery

      // Transformar para exponer dos listas: idaParaderos y retornoParaderos
      const rutas = rutasRaw.map((r) => {
        const idaParaderos = r.rutaParaderos
          ?.filter((rp: any) => rp.tipo === 'ida' && rp.paradero)
          .map((rp: any) => rp.paradero)
        const retornoParaderos = r.rutaParaderos
          ?.filter((rp: any) => rp.tipo === 'retorno' && rp.paradero)
          .map((rp: any) => rp.paradero)

        // Construir objeto limpio sin exponer la pivot completa
        const { rutaParaderos, ...rest } = r.serialize() as any
        return {
          ...rest,
          idaParaderos,
          retornoParaderos,
        }
      })

      // Barrios por nombre
      const barrios = await Barrio.query()
        .where((qb) => {
          qb.whereILike('nombre', `%${term}%`)
            .orWhereRaw('unaccent(nombre) ILIKE ?', [`%${normalized}%`])
        })
        .limit(take)

      // Paraderos por nombre
      const paraderos = await Paradero.query()
        .where((qb) => {
          qb.whereILike('nombre', `%${term}%`)
            .orWhereRaw('unaccent(nombre) ILIKE ?', [`%${normalized}%`])
        })
        .preload('barrio')
        .limit(take)

      return response.ok({
        q: term,
        rutas,
        barrios,
        paraderos,
        help: {
          routesByBarrio: '/barrios/:id/rutas',
          routesByParadero: '/paraderos/:id/rutas',
        },
      })
    } catch (error) {
      return response.internalServerError({ message: 'Error al buscar', error: String(error) })
    }
  }
}
