import { BaseSeeder } from '@adonisjs/lucid/seeders';
import Empresa from '#models/empresa';
export default class EmpresaSeeder extends BaseSeeder {
    async run() {
        await Empresa.updateOrCreateMany('idEmpresa', [
            {
                idEmpresa: 1,
                nombreEmpresa: 'Transpubenza',
                email: 'contacto@transpubenza.com',
                direccion: 'Cra 9 #12-34, Popayán',
                telefono: '8234567',
            },
            {
                idEmpresa: 2,
                nombreEmpresa: 'Translibertad',
                email: 'info@translibertad.com',
                direccion: 'Av. Libertad #45-67, Popayán',
                telefono: '8123456',
            },
            {
                idEmpresa: 3,
                nombreEmpresa: 'Transtambo',
                email: 'servicio@transtambo.com',
                direccion: 'Calle 25 #6-78, Popayán',
                telefono: '8356789',
            },
            {
                idEmpresa: 4,
                nombreEmpresa: 'Sotracauca',
                email: 'administracion@sotracauca.com',
                direccion: 'Cra 15 #20-50, Popayán',
                telefono: '8456789',
            },
        ]);
    }
}
//# sourceMappingURL=empresa_seeder.js.map