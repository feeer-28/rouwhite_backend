import { BaseModel, belongsTo, column } from '@adonisjs/lucid/orm'
import type { BelongsTo } from '@adonisjs/lucid/types/relations'
import { DateTime } from 'luxon'
import User from '#models/user'
import Empresa from '#models/empresa'

export default class Pqrs extends BaseModel {
  public static table = 'pqrs'

  @column({ isPrimary: true, columnName: 'id_pqrs' })
  declare idPQRS: number

  @column({ columnName: 'usuario_id' })
  declare usuarioId: number

  @column({ columnName: 'empresa_id' })
  declare empresaId: number

  @column()
  declare asunto: string

  @column()
  declare mensaje: string

  @column.dateTime({ columnName: 'fecha_creacion' })
  declare fechaCreacion: DateTime | null

  // Relaciones
  @belongsTo(() => User, { foreignKey: 'usuarioId' })
  declare usuario: BelongsTo<typeof User>

  @belongsTo(() => Empresa, { foreignKey: 'empresaId' })
  declare empresa: BelongsTo<typeof Empresa>
}

