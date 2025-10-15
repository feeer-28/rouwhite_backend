import router from '@adonisjs/core/services/router'
import { middleware } from './kernel.js'
import AuthController from '#controllers/authController'
import UsuarioController from '#controllers/usuarioController'
import EmpresaController from '#controllers/empresaController'
import RoleController from '#controllers/roleController'
import BarrioController from '#controllers/barrioController'
import ParaderoController from '#controllers/paraderoController'
import RutaController from '#controllers/rutaController'
import RutaParaderoController from '#controllers/rutaParaderoController'
import BusController from '#controllers/busController'
import FavoritoController from '#controllers/favoritoController'
import PqrsController from '#controllers/pqrsController'
import BusLocationController from '#controllers/busLocationController'
import SearchController from '#controllers/searchController'

// Auth routes
router.post('/auth/register', [AuthController, 'registerUsuario'])
router.post('/auth/register-admin', [AuthController, 'registerAdmin'])
router.post('/auth/login', [AuthController, 'login'])
router.post('/auth/logout', [AuthController, 'logout'])

// Búsqueda unificada (pública)
router.get('/search', [SearchController, 'search'])

// Protected route example
router.get('/me', async (ctx) => {
  const user = (ctx as any).authUser
  return { user }
}).use([middleware.jwt()])

// Users CRUD (protected)
router.group(() => {
  router.get('/listar', [UsuarioController, 'index'])
  router.get('/:id', [UsuarioController, 'show'])
  router.post('/crear', [UsuarioController, 'store'])
  router.put('/:id', [UsuarioController, 'update'])
  router.delete('/:id', [UsuarioController, 'deactivate'])
  router.put('/:id/activar', [UsuarioController, 'activate'])
}).prefix('/users').use([middleware.jwt()])

// Empresas: público para listar
router.group(() => {
  router.get('/listar', [EmpresaController, 'index'])
}).prefix('/empresas')

// Empresas CRUD (protected)
router.group(() => {
  router.get('/:id', [EmpresaController, 'show'])
  router.post('/crear', [EmpresaController, 'store'])
  router.put('/:id', [EmpresaController, 'update'])
  router.delete('/:id', [EmpresaController, 'destroy'])
}).prefix('/empresas').use([middleware.jwt()])

// Roles (protected)
router.group(() => {
  router.get('/listar', [RoleController, 'index'])
  router.post('/crear', [RoleController, 'store'])
  router.delete('/:id', [RoleController, 'destroy'])
}).prefix('/roles').use([middleware.jwt()])

// Barrios
// Públicas (sin login): buscar y ver info
router.group(() => {
  router.get('/listar', [BarrioController, 'index'])
  router.get('/:id', [BarrioController, 'show'])
  router.get('/:id/rutas', [BarrioController, 'rutas'])
}).prefix('/barrios')
// Protegidas: crear/editar/eliminar
router.group(() => {
  router.post('/crear', [BarrioController, 'store'])
  router.put('/:id', [BarrioController, 'update'])
  router.delete('/:id', [BarrioController, 'destroy'])
}).prefix('/barrios').use([middleware.jwt()])

// Paraderos
// Públicas: buscar y ver info
router.group(() => {
  router.get('/listar', [ParaderoController, 'index'])
  router.get('/:id', [ParaderoController, 'show'])
  router.get('/:id/rutas', [ParaderoController, 'rutas'])
}).prefix('/paraderos')
// Protegidas: crear/editar/eliminar
router.group(() => {
  router.post('/crear', [ParaderoController, 'store'])
  router.put('/:id', [ParaderoController, 'update'])
  router.delete('/:id', [ParaderoController, 'destroy'])
}).prefix('/paraderos').use([middleware.jwt()])

// Rutas
// Públicas: buscar y ver info
router.group(() => {
  router.get('/listar', [RutaController, 'index'])
  router.get('/:id', [RutaController, 'show'])
}).prefix('/rutas')
// Protegidas: crear/editar/eliminar
router.group(() => {
  router.post('/crear', [RutaController, 'store'])
  router.put('/:id', [RutaController, 'update'])
  router.delete('/:id', [RutaController, 'destroy'])
}).prefix('/rutas').use([middleware.jwt()])

// Ruta-Paraderos (pivot) (protegidas)
router.group(() => {
  router.get('/listar', [RutaParaderoController, 'index'])
  router.post('/crear', [RutaParaderoController, 'store'])
  router.put('/:id', [RutaParaderoController, 'update'])
  router.delete('/:id', [RutaParaderoController, 'destroy'])
}).prefix('/ruta-paraderos')

// Buses (protegidas)
router.group(() => {
  router.get('/listar', [BusController, 'index'])
  router.get('/:id', [BusController, 'show'])
  router.post('/crear', [BusController, 'store'])
  router.put('/:id', [BusController, 'update'])
  router.delete('/:id', [BusController, 'destroy'])
  router.put('/:id/activar', [BusController, 'activate'])
  router.put('/:id/desactivar', [BusController, 'deactivate'])
}).prefix('/buses')

// Favoritos (protegidas)
router.group(() => {
  router.get('/listar', [FavoritoController, 'index'])
  router.post('/crear', [FavoritoController, 'store'])
  router.delete('/:id', [FavoritoController, 'destroy'])
}).prefix('/favoritos')

// PQRS
// Públicas: listar y ver detalle
router.group(() => {
  router.get('/listar', [PqrsController, 'index'])
  router.get('/:id', [PqrsController, 'show'])
}).prefix('/pqrs')

// Protegidas: crear y eliminar PQRS
router.group(() => {
  router.post('/crear', [PqrsController, 'store'])
  router.delete('/:id', [PqrsController, 'destroy'])
}).prefix('/pqrs').use([middleware.jwt()])

// Ubicación del bus (tiempo real) (protegidas)
router.group(() => {
  // Recibir ubicación del bus (los buses/trackers envían aquí periódicamente)
  router.post('/ubicacion', [BusLocationController, 'update'])
  // Obtener ubicación actual del bus por id (solo despachadores; el middleware jwt carga el usuario)
  router.get('/ubicacion/:idBus', [BusLocationController, 'current'])
  // Stream SSE en vivo de la ubicación
  router.get('/ubicacion/:idBus/stream', [BusLocationController, 'stream'])
}).prefix('/api/bus').use([middleware.jwt()])

// Ubicación del bus (públicas, solo lectura)
router.group(() => {
  // Obtener ubicación actual del bus por id (público)
  router.get('/ubicacion/:idBus', [BusLocationController, 'publicCurrent'])
  // Stream SSE en vivo de la ubicación (público)
  router.get('/ubicacion/:idBus/stream', [BusLocationController, 'publicStream'])
}).prefix('/public/bus')

// API Buses (actualizar ubicación puntual del bus por id)
router.group(() => {
  router.put('/:id/ubicacion', [BusController, 'updateLocation'])
}).prefix('/api/buses').use([middleware.jwt()])
