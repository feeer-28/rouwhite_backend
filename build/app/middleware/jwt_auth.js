import env from '#start/env';
import jwt from 'jsonwebtoken';
import User from '#models/user';
export default class JwtAuthMiddleware {
    async handle(ctx, next) {
        const { request, response } = ctx;
        try {
            const authHeader = request.header('authorization') || request.header('Authorization');
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return response.unauthorized({ message: 'Token Bearer requerido' });
            }
            const token = authHeader.substring('Bearer '.length).trim();
            const secret = env.get('JWT_SECRET') || env.get('APP_KEY');
            const decoded = jwt.verify(token, secret);
            const payload = typeof decoded === 'string' ? { sub: decoded } : decoded;
            let userId = null;
            if (typeof payload.sub === 'number') {
                userId = payload.sub;
            }
            else if (typeof payload.sub === 'string') {
                const parsed = Number.parseInt(payload.sub, 10);
                userId = Number.isFinite(parsed) ? parsed : null;
            }
            if (!userId) {
                return response.unauthorized({ message: 'Token inválido: sin subject' });
            }
            const user = await User.find(userId);
            if (!user) {
                return response.unauthorized({ message: 'Usuario no encontrado' });
            }
            ;
            request.jwtPayload = payload;
            ctx.authUser = user;
            await next();
        }
        catch (error) {
            return response.unauthorized({ message: 'Token inválido o expirado', error: String(error) });
        }
    }
}
//# sourceMappingURL=jwt_auth.js.map