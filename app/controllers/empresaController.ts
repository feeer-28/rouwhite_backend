import type { HttpContext } from '@adonisjs/core/http'
import Empresa from '#models/empresa'

export default class EmpresaController {
  // Listar empresas con paginación
  public async index({ request, response }: HttpContext) {
    try {
      const { page = 1, perPage = 10, q } = request.qs()
      const query = Empresa.query()

      if (q) {
        query.whereILike('nombreEmpresa', `%${q}%`)
      }

      const result = await query.paginate(Number(page), Number(perPage))
      return response.ok(result)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar empresas', error: String(error) })
    }
  }

  // Obtener una empresa por ID
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const empresa = await Empresa.find(id)
      if (!empresa) {
        return response.notFound({ message: 'Empresa no encontrada' })
      }
      return response.ok(empresa)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener empresa', error: String(error) })
    }
  }

  // Crear empresa
  public async store({ request, response }: HttpContext) {
    try {
      const { nombreEmpresa, email, direccion, telefono } = request.only([
        'nombreEmpresa',
        'email',
        'direccion',
        'telefono',
      ])

      if (!nombreEmpresa) {
        return response.badRequest({ message: 'nombreEmpresa es requerido' })
      }

      const exists = await Empresa.query().where('nombreEmpresa', nombreEmpresa).first()
      if (exists) {
        return response.conflict({ message: 'La empresa ya existe' })
      }

      const empresa = await Empresa.create({ nombreEmpresa, email, direccion, telefono })
      return response.created({ message: 'Empresa creada correctamente', empresa })
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear empresa', error: String(error) })
    }
  }

  // Actualizar empresa
  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const payload = request.only(['nombreEmpresa', 'email', 'direccion', 'telefono'])

      const empresa = await Empresa.find(id)
      if (!empresa) {
        return response.notFound({ message: 'Empresa no encontrada' })
      }

      if (payload.nombreEmpresa && payload.nombreEmpresa !== empresa.nombreEmpresa) {
        const nameExists = await Empresa.query()
          .where('nombreEmpresa', payload.nombreEmpresa)
          .andWhereNot('idEmpresa', id)
          .first()
        if (nameExists) {
          return response.conflict({ message: 'El nombre de empresa ya está en uso' })
        }
      }

      empresa.merge({
        nombreEmpresa: payload.nombreEmpresa ?? empresa.nombreEmpresa,
        email: payload.email ?? empresa.email,
        direccion: payload.direccion ?? empresa.direccion,
        telefono: payload.telefono ?? empresa.telefono,
      })
      await empresa.save()

      return response.ok({ message: 'Empresa actualizada', empresa })
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar empresa', error: String(error) })
    }
  }

  // Eliminar empresa (hard delete)
  public async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params
      const empresa = await Empresa.find(id)
      if (!empresa) {
        return response.notFound({ message: 'Empresa no encontrada' })
      }

      await empresa.delete()
      return response.ok({ message: 'Empresa eliminada' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar empresa', error: String(error) })
    }
  }
}

