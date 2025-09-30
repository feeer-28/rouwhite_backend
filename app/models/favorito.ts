
import { BaseModel, column, belongsTo } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import User from '#models/user'
import Ruta from '#models/ruta'

export default class Favorito extends BaseModel {
  static table = 'favoritos'

  @column({ isPrimary: true, columnName: 'id_favorito' })
  declare idFavorito: number

  @column({ columnName: 'usuario_id' })
  declare usuarioId: number

  @column({ columnName: 'ruta_id' })
  declare rutaId: number

  // Relaciones
  @belongsTo(() => User, {
    foreignKey: 'usuarioId',
  })
  declare usuario: BelongsTo<typeof User>

  @belongsTo(() => Ruta, {
    foreignKey: 'rutaId',
  })
  declare ruta: BelongsTo<typeof Ruta>
}