import { BaseSchema } from '@adonisjs/lucid/schema';
export default class AlterUsuariosPasswordLength extends BaseSchema {
    tableName = 'usuarios';
    async up() {
        this.schema.alterTable(this.tableName, (table) => {
            table.text('password').alter();
        });
    }
    async down() {
    }
}
//# sourceMappingURL=1758492000000_alter_usuarios_password_length.js.map