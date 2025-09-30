import Favorito from '#models/favorito';
import Ruta from '#models/ruta';
export default class FavoritoController {
    async index({ request, response }) {
        try {
            const user = request.authUser;
            if (!user)
                return response.unauthorized({ message: 'No autenticado' });
            const favoritos = await Favorito.query()
                .where('usuario_id', user.idUsuario)
                .preload('ruta');
            return response.ok(favoritos);
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al listar favoritos', error: String(error) });
        }
    }
    async store({ request, response }) {
        try {
            const user = request.authUser;
            if (!user)
                return response.unauthorized({ message: 'No autenticado' });
            const { rutaId } = request.only(['rutaId']);
            if (!rutaId)
                return response.badRequest({ message: 'rutaId es requerido' });
            const ruta = await Ruta.find(rutaId);
            if (!ruta)
                return response.badRequest({ message: 'rutaId inválido' });
            const exists = await Favorito.query()
                .where('usuario_id', user.idUsuario)
                .andWhere('ruta_id', rutaId)
                .first();
            if (exists)
                return response.conflict({ message: 'La ruta ya está en favoritos' });
            const favorito = await Favorito.create({ usuarioId: user.idUsuario, rutaId });
            return response.created({ message: 'Agregado a favoritos', favorito });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al agregar favorito', error: String(error) });
        }
    }
    async destroy({ params, request, response }) {
        try {
            const user = request.authUser;
            if (!user)
                return response.unauthorized({ message: 'No autenticado' });
            const { id } = params;
            const favorito = await Favorito.query()
                .where('id_favorito', id)
                .andWhere('usuario_id', user.idUsuario)
                .first();
            if (!favorito)
                return response.notFound({ message: 'Favorito no encontrado' });
            await favorito.delete();
            return response.ok({ message: 'Favorito eliminado' });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al eliminar favorito', error: String(error) });
        }
    }
}
//# sourceMappingURL=favoritoController.js.map