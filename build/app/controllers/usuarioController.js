import User from '#models/user';
import bcrypt from 'bcrypt';
export default class UsuarioController {
    async store({ request, response }) {
        try {
            const { nombre, apellido, email, password, identificacion, rolId, empresaId, } = request.only([
                'nombre',
                'apellido',
                'email',
                'password',
                'identificacion',
                'rolId',
                'empresaId',
            ]);
            if (!nombre || !apellido || !email || !password || !identificacion || !rolId) {
                return response.badRequest({ message: 'Faltan campos obligatorios' });
            }
            const exists = await User.query().where('email', email).first();
            if (exists) {
                return response.conflict({ message: 'El email ya está registrado' });
            }
            const passwordHash = await bcrypt.hash(password, 10);
            const user = await User.create({
                nombre,
                apellido,
                email,
                password: passwordHash,
                identificacion,
                rolId,
                empresaId: empresaId ?? null,
            });
            return response.created({
                message: 'Usuario creado correctamente',
                user,
            });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al crear usuario', error: String(error) });
        }
    }
    async index({ response }) {
        try {
            const users = await User.query()
                .preload('rol')
                .preload('empresa')
                .orderBy('idUsuario', 'desc');
            return response.ok(users);
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al obtener usuarios', error: String(error) });
        }
    }
    async show({ params, response }) {
        try {
            const { id } = params;
            const user = await User.query().where('idUsuario', id).preload('rol').preload('empresa').first();
            if (!user) {
                return response.notFound({ message: 'Usuario no encontrado' });
            }
            return response.ok(user);
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al obtener usuario', error: String(error) });
        }
    }
    async update({ params, request, response }) {
        try {
            const { id } = params;
            const payload = request.only(['nombre', 'apellido', 'email', 'password', 'identificacion', 'rolId', 'empresaId']);
            const user = await User.find(id);
            if (!user) {
                return response.notFound({ message: 'Usuario no encontrado' });
            }
            if (payload.email && payload.email !== user.email) {
                const emailExists = await User.query().where('email', payload.email).andWhereNot('idUsuario', id).first();
                if (emailExists) {
                    return response.conflict({ message: 'El email ya está en uso' });
                }
            }
            if (payload.password) {
                payload.password = await bcrypt.hash(payload.password, 10);
            }
            user.merge({
                nombre: payload.nombre ?? user.nombre,
                apellido: payload.apellido ?? user.apellido,
                email: payload.email ?? user.email,
                password: payload.password ?? user.password,
                identificacion: payload.identificacion ?? user.identificacion,
                rolId: payload.rolId ?? user.rolId,
                empresaId: payload.empresaId ?? user.empresaId,
            });
            await user.save();
            return response.ok({ message: 'Usuario actualizado', user });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al actualizar usuario', error: String(error) });
        }
    }
    async deactivate({ params, response }) {
        try {
            const { id } = params;
            const user = await User.find(id);
            if (!user) {
                return response.notFound({ message: 'Usuario no encontrado' });
            }
            user.merge({ estado: false });
            await user.save();
            return response.ok({ message: 'Usuario desactivado', user });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al desactivar usuario', error: String(error) });
        }
    }
}
//# sourceMappingURL=usuarioController.js.map