import { BaseSchema } from '@adonisjs/lucid/schema';
export default class AddEstadoToUsuarios extends BaseSchema {
    tableName = 'usuarios';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.boolean('estado').notNullable().defaultTo(true);
        });
    }
    async down() {
        this.schema.alterTable(this.tableName, (table) => {
            table.dropColumn('estado');
        });
    }
}
//# sourceMappingURL=1758491700000_add_estado_to_usuarios.js.map