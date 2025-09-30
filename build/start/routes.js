import router from '@adonisjs/core/services/router';
import { middleware } from './kernel.js';
import AuthController from '#controllers/authController';
import UsuarioController from '#controllers/usuarioController';
import EmpresaController from '#controllers/empresaController';
import RoleController from '#controllers/roleController';
import BarrioController from '#controllers/barrioController';
import ParaderoController from '#controllers/paraderoController';
import RutaController from '#controllers/rutaController';
import RutaParaderoController from '#controllers/rutaParaderoController';
import BusController from '#controllers/busController';
import FavoritoController from '#controllers/favoritoController';
import PqrsController from '#controllers/pqrsController';
import BusLocationController from '#controllers/busLocationController';
router.get('/', async () => {
    return {
        hello: 'world',
    };
});
router.post('/auth/register', [AuthController, 'register']);
router.post('/auth/login', [AuthController, 'login']);
router.post('/auth/logout', [AuthController, 'logout']);
router.get('/me', async (ctx) => {
    const user = ctx.authUser;
    return { user };
}).use([middleware.jwt()]);
router.group(() => {
    router.get('/listar', [UsuarioController, 'index']);
    router.get('/:id', [UsuarioController, 'show']);
    router.post('/crear', [UsuarioController, 'store']);
    router.put('/:id', [UsuarioController, 'update']);
    router.delete('/:id', [UsuarioController, 'deactivate']);
}).prefix('/users').use([middleware.jwt()]);
router.group(() => {
    router.get('/listar', [EmpresaController, 'index']);
    router.get('/:id', [EmpresaController, 'show']);
    router.post('/crear', [EmpresaController, 'store']);
    router.put('/:id', [EmpresaController, 'update']);
    router.delete('/:id', [EmpresaController, 'destroy']);
}).prefix('/empresas').use([middleware.jwt()]);
router.group(() => {
    router.get('/listar', [RoleController, 'index']);
    router.post('/crear', [RoleController, 'store']);
    router.delete('/:id', [RoleController, 'destroy']);
}).prefix('/roles').use([middleware.jwt()]);
router.group(() => {
    router.get('/listar', [BarrioController, 'index']);
    router.get('/:id', [BarrioController, 'show']);
}).prefix('/barrios');
router.group(() => {
    router.post('/crear', [BarrioController, 'store']);
    router.put('/:id', [BarrioController, 'update']);
    router.delete('/:id', [BarrioController, 'destroy']);
}).prefix('/barrios').use([middleware.jwt()]);
router.group(() => {
    router.get('/listar', [ParaderoController, 'index']);
    router.get('/:id', [ParaderoController, 'show']);
}).prefix('/paraderos');
router.group(() => {
    router.post('/crear', [ParaderoController, 'store']);
    router.put('/:id', [ParaderoController, 'update']);
    router.delete('/:id', [ParaderoController, 'destroy']);
}).prefix('/paraderos').use([middleware.jwt()]);
router.group(() => {
    router.get('/listar', [RutaController, 'index']);
    router.get('/:id', [RutaController, 'show']);
}).prefix('/rutas');
router.group(() => {
    router.post('/crear', [RutaController, 'store']);
    router.put('/:id', [RutaController, 'update']);
    router.delete('/:id', [RutaController, 'destroy']);
}).prefix('/rutas').use([middleware.jwt()]);
router.group(() => {
    router.get('/listar', [RutaParaderoController, 'index']);
    router.post('/crear', [RutaParaderoController, 'store']);
    router.put('/:id', [RutaParaderoController, 'update']);
    router.delete('/:id', [RutaParaderoController, 'destroy']);
}).prefix('/ruta-paraderos').use([middleware.jwt()]);
router.group(() => {
    router.get('/listar', [BusController, 'index']);
    router.get('/:id', [BusController, 'show']);
    router.post('/crear', [BusController, 'store']);
    router.put('/:id', [BusController, 'update']);
    router.delete('/:id', [BusController, 'destroy']);
    router.put('/:id/activar', [BusController, 'activate']);
    router.put('/:id/desactivar', [BusController, 'deactivate']);
}).prefix('/buses').use([middleware.jwt()]);
router.group(() => {
    router.get('/listar', [FavoritoController, 'index']);
    router.post('/crear', [FavoritoController, 'store']);
    router.delete('/:id', [FavoritoController, 'destroy']);
}).prefix('/favoritos').use([middleware.jwt()]);
router.group(() => {
    router.get('/listar', [PqrsController, 'index']);
    router.get('/:id', [PqrsController, 'show']);
}).prefix('/pqrs');
router.group(() => {
    router.post('/crear', [PqrsController, 'store']);
    router.delete('/:id', [PqrsController, 'destroy']);
}).prefix('/pqrs').use([middleware.jwt()]);
router.group(() => {
    router.post('/ubicacion', [BusLocationController, 'update']);
    router.get('/ubicacion/:idBus', [BusLocationController, 'current']);
    router.get('/ubicacion/:idBus/stream', [BusLocationController, 'stream']);
}).prefix('/api/bus').use([middleware.jwt()]);
//# sourceMappingURL=routes.js.map