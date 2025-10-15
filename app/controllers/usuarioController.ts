import type { HttpContext } from '@adonisjs/core/http'
import User from '#models/user'
import Role, { RolTipo } from '#models/role'

export default class UsuarioController {
  // Crear usuario
  public async store({ request, response }: HttpContext) {
    try {
      const body = request.all()
      const nombre: string | undefined = body.nombre
      const apellido: string | undefined = body.apellido
      const email: string | undefined = body.email
      const password: string | undefined = body.password
      const identificacion: string | undefined = body.identificacion
      const rolId: number | undefined = body.rolId ?? body.rol_id
      const empresaId: number | null | undefined = (body.empresaId ?? body.empresa_id) ?? null

      if (!nombre || !apellido || !email || !password || !identificacion || !rolId) {
        return response.badRequest({ message: 'Faltan campos obligatorios' })
      }

      const exists = await User.query().where('email', email).first()
      if (exists) {
        return response.conflict({ message: 'El email ya está registrado' })
      }

      const user = await User.create({
        nombre,
        apellido,
        email,
        password,
        identificacion,
        rolId,
        empresaId: empresaId ?? null,
      })

      return response.created({
        message: 'Usuario creado correctamente',
        user,
      })
    } catch (error) {
      return response.internalServerError({ message: 'Error al crear usuario', error: String(error) })
    }
  }

  // Listar usuarios
  public async index({ request, response }: HttpContext) {
    try {
      const { empresaId, empresa_id } = request.qs()
      const query = User.query().preload('rol').preload('empresa').orderBy('idUsuario', 'desc')

      // Permitir que ADMIN liste todos los usuarios (sin filtro por empresa)
      const jwtPayload = (request as any)?.jwtPayload as { rolId?: number; empresaId?: number } | undefined
      let isAdmin = false
      if (jwtPayload?.rolId) {
        const role = await Role.find(jwtPayload.rolId)
        isAdmin = role?.nombreRol === RolTipo.ADMIN
      }

      if (!isAdmin) {
        const jwtEmpresaId = jwtPayload?.empresaId
        const empId = Number(empresaId ?? empresa_id ?? jwtEmpresaId)
        if (Number.isFinite(empId)) {
          query.where('empresa_id', empId)
        }
      }

      const users = await query
      return response.ok(users)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener usuarios', error: String(error) })
    }
  }

  // Obtener detalle de un usuario
  public async show({ params, response }: HttpContext) {
    try {
      const { id } = params
      const user = await User.query().where('idUsuario', id).preload('rol').preload('empresa').first()
      if (!user) {
        return response.notFound({ message: 'Usuario no encontrado' })
      }
      return response.ok(user)
    } catch (error) {
      return response.internalServerError({ message: 'Error al obtener usuario', error: String(error) })
    }
  }

  // Actualizar usuario
  public async update({ params, request, response }: HttpContext) {
    try {
      const { id } = params
      const body = request.all()
      const payload: any = {
        nombre: body.nombre,
        apellido: body.apellido,
        email: body.email,
        password: body.password,
        identificacion: body.identificacion,
        rolId: body.rolId ?? body.rol_id,
        empresaId: (body.empresaId ?? body.empresa_id),
      }

      const user = await User.find(id)
      if (!user) {
        return response.notFound({ message: 'Usuario no encontrado' })
      }

      if (payload.email && payload.email !== user.email) {
        const emailExists = await User.query().where('email', payload.email).andWhereNot('idUsuario', id).first()
        if (emailExists) {
          return response.conflict({ message: 'El email ya está en uso' })
        }
      }

      user.merge({
        nombre: payload.nombre ?? user.nombre,
        apellido: payload.apellido ?? user.apellido,
        email: payload.email ?? user.email,
        password: payload.password ?? user.password,
        identificacion: payload.identificacion ?? user.identificacion,
        rolId: payload.rolId ?? user.rolId,
        empresaId: (payload.empresaId !== undefined ? payload.empresaId : user.empresaId),
      })
      await user.save()

      return response.ok({ message: 'Usuario actualizado', user })
    } catch (error) {
      return response.internalServerError({ message: 'Error al actualizar usuario', error: String(error) })
    }
  }

  // Desactivar usuario
  public async deactivate({ params, response }: HttpContext) {
    try {
      const { id } = params
      const user = await User.find(id)
      if (!user) {
        return response.notFound({ message: 'Usuario no encontrado' })
      }

      // Desactivar usuario usando el campo booleano 'estado'
      user.merge({ estado: false })
      await user.save()
      return response.ok({ message: 'Usuario desactivado', user })
    } catch (error) {
      return response.internalServerError({ message: 'Error al desactivar usuario', error: String(error) })
    }
  }

  // Activar usuario
  public async activate({ params, response }: HttpContext) {
    try {
      const { id } = params
      const user = await User.find(id)
      if (!user) {
        return response.notFound({ message: 'Usuario no encontrado' })
      }

      user.merge({ estado: true })
      await user.save()
      return response.ok({ message: 'Usuario activado', user })
    } catch (error) {
      return response.internalServerError({ message: 'Error al activar usuario', error: String(error) })
    }
  }
}

