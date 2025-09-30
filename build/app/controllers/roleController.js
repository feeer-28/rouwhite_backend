import Role, { RolTipo } from '#models/role';
export default class RoleController {
    async index({ response }) {
        try {
            const roles = await Role.all();
            return response.ok(roles);
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al listar roles', error: String(error) });
        }
    }
    async store({ request, response }) {
        try {
            const { nombreRol } = request.only(['nombreRol']);
            if (!nombreRol) {
                return response.badRequest({ message: 'nombreRol es requerido' });
            }
            const allowed = Object.values(RolTipo);
            if (!allowed.includes(nombreRol)) {
                return response.badRequest({ message: `nombreRol inválido. Valores permitidos: ${allowed.join(', ')}` });
            }
            const exists = await Role.query().where('nombreRol', nombreRol).first();
            if (exists) {
                return response.conflict({ message: 'El rol ya existe' });
            }
            const role = await Role.create({ nombreRol: nombreRol });
            return response.created({ message: 'Rol creado correctamente', role });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al crear rol', error: String(error) });
        }
    }
    async destroy({ params, response }) {
        try {
            const { id } = params;
            const role = await Role.find(id);
            if (!role) {
                return response.notFound({ message: 'Rol no encontrado' });
            }
            await role.delete();
            return response.ok({ message: 'Rol eliminado' });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al eliminar rol', error: String(error) });
        }
    }
}
//# sourceMappingURL=roleController.js.map