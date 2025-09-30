import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Role, { RolTipo } from '#models/role'

export default class RoleSeeder extends BaseSeeder {
  public static environment: string[] = ['development', 'production', 'test']

  public async run() {
    const roles: RolTipo[] = [RolTipo.ADMIN, RolTipo.DESPACHADOR, RolTipo.CONDUCTOR, RolTipo.USUARIO]

    for (const nombreRol of roles) {
      await Role.firstOrCreate(
        { nombreRol },
        { nombreRol }
      )
    }
  }
}
