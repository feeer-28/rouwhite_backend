import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AlterUsuariosPasswordLength extends BaseSchema {
  protected tableName = 'usuarios'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Asegurar que la columna password pueda almacenar hashes largos (bcrypt/scrypt)
      // En Postgres, usar text es suficiente. Si ya es text, no pasa nada.
      table.text('password').alter()
    })
  }

  async down() {
    // Si antes era varchar(60) podríamos regresarlo, pero es inseguro adivinar.
    // Dejamos el down vacío para no truncar accidentalmente datos.
  }
}
