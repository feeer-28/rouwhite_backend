import { BaseSchema } from '@adonisjs/lucid/schema'

export default class AddEstadoToBuses extends BaseSchema {
  protected tableName = 'buses'

  async up() {
    this.schema.alterTable(this.tableName, (table) => {
      // Agrega columna boolean "estado" con default true y not null
      table.boolean('estado').notNullable().defaultTo(true)
    })
  }

  async down() {
    this.schema.alterTable(this.tableName, (table) => {
      table.dropColumn('estado')
    })
  }
}
