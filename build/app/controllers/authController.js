import env from '#start/env';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import logger from '@adonisjs/core/services/logger';
import hash from '@adonisjs/core/services/hash';
import User from '#models/user';
import Role from '#models/role';
import { RolTipo } from '#models/role';
import { registerUsuarioValidator, registerAdminValidator, loginValidator } from '#validators/auth';
export default class AuthController {
    async registerUsuario({ request, response }) {
        try {
            const payload = await registerUsuarioValidator.validate(request.all());
            const email = payload.email.trim().toLowerCase();
            const exists = await User.query().where('email', email).first();
            if (exists)
                return response.conflict({ message: 'El email ya está registrado' });
            const rol = await Role.query().where('nombre_rol', RolTipo.USUARIO).first();
            if (!rol)
                return response.internalServerError({ message: 'Rol USUARIO no configurado' });
            const passwordHash = await bcrypt.hash(String(payload.password), 10);
            const user = await User.create({
                nombre: payload.nombre,
                apellido: payload.apellido,
                email,
                password: passwordHash,
                identificacion: payload.identificacion,
                rolId: rol.idRol,
                empresaId: null,
            });
            return response.created({
                message: 'Usuario registrado correctamente',
                user: {
                    idUsuario: user.idUsuario,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email,
                    identificacion: user.identificacion,
                    rolId: user.rolId,
                    empresaId: user.empresaId,
                },
            });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al registrar usuario', error: String(error) });
        }
    }
    async registerAdmin({ request, response }) {
        try {
            const payload = await registerAdminValidator.validate(request.all());
            const email = payload.email.trim().toLowerCase();
            const exists = await User.query().where('email', email).first();
            if (exists)
                return response.conflict({ message: 'El email ya está registrado' });
            const rol = await Role.query().where('nombre_rol', RolTipo.ADMIN).first();
            if (!rol)
                return response.internalServerError({ message: 'Rol ADMIN no configurado' });
            const passwordPlain = String(payload.password);
            const user = await User.create({
                nombre: payload.nombre,
                apellido: payload.apellido,
                email,
                password: passwordPlain,
                identificacion: payload.identificacion,
                rolId: rol.idRol,
                empresaId: null,
            });
            return response.created({
                message: 'Admin registrado correctamente',
                user: {
                    idUsuario: user.idUsuario,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email,
                    identificacion: user.identificacion,
                    rolId: user.rolId,
                    empresaId: user.empresaId,
                },
            });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al registrar admin', error: String(error) });
        }
    }
    async login({ request, response }) {
        try {
            const { email, password } = await loginValidator.validate(request.all());
            const emailNormalized = email.trim().toLowerCase();
            logger.info('[AUTH][LOGIN] emailNormalized: %s', emailNormalized);
            const user = await User.query().where('email', emailNormalized).first();
            logger.info('[AUTH][LOGIN] userFound: %s', !!user);
            if (!user)
                return response.unauthorized({ message: 'Credenciales inválidas' });
            const plain = String(password);
            const stored = String(user.password || '');
            const storedPreview = stored ? stored.slice(0, 12) : '';
            logger.info('[AUTH][LOGIN] stored hash preview: %s', storedPreview);
            logger.info('[AUTH][LOGIN] stored hash length: %s', stored.length);
            let valid = false;
            if (stored.startsWith('$2')) {
                valid = await bcrypt.compare(plain, stored);
                logger.info('[AUTH][LOGIN] bcrypt.compare result: %s', valid);
            }
            if (!valid && stored.startsWith('$bcrypt$')) {
                const adonisOk = await hash.verify(stored, plain);
                logger.info('[AUTH][LOGIN] adonis hash.verify result: %s', adonisOk);
                if (adonisOk) {
                    const migrated = await bcrypt.hash(plain, 10);
                    user.password = migrated;
                    await user.save();
                    valid = true;
                    logger.info('[AUTH][LOGIN] migrated from $bcrypt$ to $2b$');
                }
            }
            if (!valid && !stored.startsWith('$')) {
                valid = stored === plain;
                logger.info('[AUTH][LOGIN] fallback plain compare result: %s', valid);
                if (valid) {
                    user.password = await bcrypt.hash(plain, 10);
                    await user.save();
                    logger.info('[AUTH][LOGIN] migrated plaintext -> $2b$');
                }
            }
            if (!valid)
                return response.unauthorized({ message: 'Credenciales inválidas' });
            const secret = env.get('JWT_SECRET') || env.get('APP_KEY');
            const token = jwt.sign({
                sub: user.idUsuario,
                email: user.email,
                rolId: user.rolId,
            }, secret, { expiresIn: '1d' });
            return response.ok({
                message: 'Login exitoso',
                token,
                user: {
                    idUsuario: user.idUsuario,
                    nombre: user.nombre,
                    apellido: user.apellido,
                    email: user.email,
                    identificacion: user.identificacion,
                    rolId: user.rolId,
                    empresaId: user.empresaId,
                },
            });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al iniciar sesión', error: String(error) });
        }
    }
    async logout({ response }) {
        try {
            return response.ok({ message: 'Logout exitoso' });
        }
        catch (error) {
            return response.internalServerError({ message: 'Error al cerrar sesión', error: String(error) });
        }
    }
}
//# sourceMappingURL=authController.js.map