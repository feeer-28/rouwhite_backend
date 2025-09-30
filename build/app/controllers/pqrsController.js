import Pqrs from '#models/pqrs';
import vine from '@vinejs/vine';
export default class PqrsController {
    async index({ request, response }) {
        try {
            const querySchema = vine.object({
                usuarioId: vine.number().positive().optional(),
                empresaId: vine.number().positive().optional(),
            });
            const { usuarioId, empresaId } = await vine.validate({ schema: querySchema, data: request.qs() });
            const q = Pqrs.query().preload('usuario').preload('empresa').orderBy('idPQRS', 'desc');
            if (usuarioId)
                q.where('usuarioId', usuarioId);
            if (empresaId)
                q.where('empresaId', empresaId);
            const items = await q;
            return response.ok(items);
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al listar PQRS', error: String(error) });
        }
    }
    async show({ params, response }) {
        try {
            const id = Number(params.id);
            if (!Number.isFinite(id))
                return response.badRequest({ message: 'Id inválido' });
            const item = await Pqrs.query().where('idPQRS', id).preload('usuario').preload('empresa').first();
            if (!item)
                return response.notFound({ message: 'PQRS no encontrado' });
            return response.ok(item);
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al obtener PQRS', error: String(error) });
        }
    }
    async store(ctx) {
        const { request, response } = ctx;
        try {
            const schema = vine.object({
                empresaId: vine.number().positive(),
                asunto: vine.string().trim().maxLength(150),
                mensaje: vine.string().trim().minLength(1),
            });
            const payload = await vine.validate({ schema, data: request.all() });
            const authUser = ctx.authUser;
            if (!authUser)
                return response.unauthorized({ message: 'No autenticado' });
            const pqrs = await Pqrs.create({
                usuarioId: authUser.idUsuario,
                empresaId: payload.empresaId,
                asunto: payload.asunto,
                mensaje: payload.mensaje,
            });
            await pqrs.load('usuario');
            await pqrs.load('empresa');
            return response.created({ message: 'PQRS creada', pqrs });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al crear PQRS', error: String(error) });
        }
    }
    async destroy({ params, response }) {
        try {
            const id = Number(params.id);
            if (!Number.isFinite(id))
                return response.badRequest({ message: 'Id inválido' });
            const item = await Pqrs.find(id);
            if (!item)
                return response.notFound({ message: 'PQRS no encontrado' });
            await item.delete();
            return response.ok({ message: 'PQRS eliminada' });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al eliminar PQRS', error: String(error) });
        }
    }
}
//# sourceMappingURL=pqrsController.js.map