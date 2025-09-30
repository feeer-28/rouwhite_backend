import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Role, { RolTipo } from '#models/role';
export default class RoleSeeder extends BaseSeeder {
    static environment = ['development', 'production', 'test'];
    async run() {
        const roles = [RolTipo.ADMIN, RolTipo.DESPACHADOR, RolTipo.CONDUCTOR, RolTipo.USUARIO];
        for (const nombreRol of roles) {
            await Role.firstOrCreate({ nombreRol }, { nombreRol });
        }
    }
}
//# sourceMappingURL=role_seeder.js.map