
import { BaseModel, column, belongsTo, hasMany } from '@adonisjs/lucid/orm'
import { DbAccessTokensProvider } from '@adonisjs/auth/access_tokens'
import type { BelongsTo, HasMany } from '@adonisjs/lucid/types/relations'
import Role from '#models/role'
import Empresa from '#models/empresa'
import Favorito from '#models/favorito'
import Pqrs from '#models/pqrs'

export default class User extends BaseModel {
  static table = 'usuarios'

  @column({ isPrimary: true, columnName: 'id_usuario' })
  declare idUsuario: number

  @column()
  declare nombre: string

  @column()
  declare apellido: string

  @column()
  declare email: string

  @column({ serializeAs: null })
  declare password: string

  @column()
  declare identificacion: string

  @column()
  declare estado: boolean

  @column({ columnName: 'rol_id' })
  declare rolId: number

  @column({ columnName: 'empresa_id' })
  declare empresaId: number | null



  // Relaciones
  @belongsTo(() => Role, {
    foreignKey: 'rolId'
  })
  declare rol: BelongsTo<typeof Role>

  @hasMany(() => Pqrs, {
    foreignKey: 'usuarioId'
  })
  declare pqrs: HasMany<typeof Pqrs>

  @belongsTo(() => Empresa, {
    foreignKey: 'empresaId'
  })
  declare empresa: BelongsTo<typeof Empresa>

  @hasMany(() => Favorito, {
    foreignKey: 'usuarioId'
  })
  declare favoritos: HasMany<typeof Favorito>

  static accessTokens = DbAccessTokensProvider.forModel(User)
}