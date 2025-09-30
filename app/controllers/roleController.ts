import type { HttpContext } from '@adonisjs/core/http'
import Role, { RolTipo } from '#models/role'

export default class RoleController {
  // Listar roles
  public async index({ response }: HttpContext) {
    try {
      const roles = await Role.all()
      return response.ok(roles)
    } catch (error) {
      return response.internalServerError({ message: 'Error al listar roles', error: String(error) })
    }
  }

  // Crear rol
  public async store({ request, response }: HttpContext) {
    try {
      const { nombreRol } = request.only(['nombreRol']) as { nombreRol?: RolTipo | string }
      if (!nombreRol) {
        return response.badRequest({ message: 'nombreRol es requerido' })
      }

      // Validar que sea un valor válido del enum
      const allowed = Object.values(RolTipo)
      if (!allowed.includes(nombreRol as RolTipo)) {
        return response.badRequest({ message: `nombreRol inválido. Valores permitidos: ${allowed.join(', ')}` })
      }

      const exists = await Role.query().where('nombreRol', nombreRol as RolTipo).first()
      if (exists) {
        return response.conflict({ message: 'El rol ya existe' })
      }

      const role = await Role.create({ nombreRol: nombreRol as RolTipo })
      return response.created({ message: 'Rol creado correctamente', role })
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear rol', error: String(error) })
    }
  }

  // Eliminar rol
  public async destroy({ params, response }: HttpContext) {
    try {
      const { id } = params
      const role = await Role.find(id)
      if (!role) {
        return response.notFound({ message: 'Rol no encontrado' })
      }

      await role.delete()
      return response.ok({ message: 'Rol eliminado' })
    } catch (error) {
      return response.internalServerError({ message: 'Error al eliminar rol', error: String(error) })
    }
  }
}

