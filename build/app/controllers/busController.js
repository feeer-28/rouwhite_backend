import Bus from '#models/bus';
import Empresa from '#models/empresa';
export default class BusController {
    async index({ request, response }) {
        try {
            const { page = 1, perPage = 10, q } = request.qs();
            const query = Bus.query().preload('empresa');
            if (q) {
                query.whereILike('placa', `%${q}%`);
            }
            const result = await query.paginate(Number(page), Number(perPage));
            return response.ok(result);
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al listar buses', error: String(error) });
        }
    }
    async show({ params, response }) {
        try {
            const { id } = params;
            const bus = await Bus.query().where('idBus', id).preload('empresa').first();
            if (!bus) {
                return response.notFound({ message: 'Bus no encontrado' });
            }
            return response.ok(bus);
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al obtener bus', error: String(error) });
        }
    }
    async store({ request, response }) {
        try {
            const { placa, descripcion, empresaId, latitud, longitud, estado } = request.only([
                'placa',
                'descripcion',
                'empresaId',
                'latitud',
                'longitud',
                'estado',
            ]);
            if (!placa || !empresaId) {
                return response.badRequest({ message: 'placa y empresaId son requeridos' });
            }
            const empresa = await Empresa.find(empresaId);
            if (!empresa) {
                return response.badRequest({ message: 'empresaId inválido' });
            }
            const exists = await Bus.query().where('placa', placa).first();
            if (exists) {
                return response.conflict({ message: 'Ya existe un bus con esa placa' });
            }
            const bus = await Bus.create({ placa, descripcion, empresaId, latitud, longitud, estado });
            return response.created({ message: 'Bus creado correctamente', bus });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al crear bus', error: String(error) });
        }
    }
    async update({ params, request, response }) {
        try {
            const { id } = params;
            const payload = request.only(['placa', 'descripcion', 'empresaId', 'latitud', 'longitud', 'estado']);
            const bus = await Bus.find(id);
            if (!bus) {
                return response.notFound({ message: 'Bus no encontrado' });
            }
            if (payload.empresaId) {
                const empresa = await Empresa.find(payload.empresaId);
                if (!empresa) {
                    return response.badRequest({ message: 'empresaId inválido' });
                }
            }
            if (payload.placa && payload.placa !== bus.placa) {
                const dup = await Bus.query().where('placa', payload.placa).andWhereNot('idBus', id).first();
                if (dup) {
                    return response.conflict({ message: 'Ya existe un bus con esa placa' });
                }
            }
            bus.merge({
                placa: payload.placa ?? bus.placa,
                descripcion: payload.descripcion ?? bus.descripcion,
                empresaId: payload.empresaId ?? bus.empresaId,
                latitud: payload.latitud ?? bus.latitud,
                longitud: payload.longitud ?? bus.longitud,
                estado: payload.estado ?? bus.estado,
            });
            await bus.save();
            return response.ok({ message: 'Bus actualizado', bus });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al actualizar bus', error: String(error) });
        }
    }
    async destroy({ params, response }) {
        try {
            const { id } = params;
            const bus = await Bus.find(id);
            if (!bus) {
                return response.notFound({ message: 'Bus no encontrado' });
            }
            await bus.delete();
            return response.ok({ message: 'Bus eliminado' });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al eliminar bus', error: String(error) });
        }
    }
    async activate({ params, response }) {
        try {
            const { id } = params;
            const bus = await Bus.find(id);
            if (!bus)
                return response.notFound({ message: 'Bus no encontrado' });
            bus.estado = true;
            await bus.save();
            return response.ok({ message: 'Bus activado', bus });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al activar bus', error: String(error) });
        }
    }
    async deactivate({ params, response }) {
        try {
            const { id } = params;
            const bus = await Bus.find(id);
            if (!bus)
                return response.notFound({ message: 'Bus no encontrado' });
            bus.estado = false;
            await bus.save();
            return response.ok({ message: 'Bus desactivado', bus });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al desactivar bus', error: String(error) });
        }
    }
}
//# sourceMappingURL=busController.js.map