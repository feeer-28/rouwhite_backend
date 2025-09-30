import { BaseSeeder } from '@adonisjs/lucid/seeders'
import User from '#models/user'
import Role, { RolTipo } from '#models/role'
import hash from '@adonisjs/core/services/hash'

export default class UserSeeder extends BaseSeeder {
  public static environment: string[] = ['development', 'production', 'test']

  public async run() {
    // Ensure admin role exists
    const adminRole = await Role.firstOrCreate({ nombreRol: RolTipo.ADMIN }, { nombreRol: RolTipo.ADMIN })

    const email = 'admin@local.test'

    const exists = await User.query().where('email', email).first()
    if (!exists) {
      await User.create({
        nombre: 'Admin',
        apellido: 'System',
        email,
        password: await hash.make('admin123'),
        identificacion: 'ADMIN001',
        rolId: adminRole.idRol,
        empresaId: null,
      })
    }
  }
}
