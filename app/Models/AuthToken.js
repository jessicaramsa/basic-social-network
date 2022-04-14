'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/**
*  @swagger
*  definitions:
*    AuthToken:
*      type: object
*      properties:
*        id:
*          type: uint
*        user_id:
*          type: uint
*        token:
*          type: string
*        is_revoked:
*          type: boolean
*      required:
*        - user_id
*        - token
*/
class AuthToken extends Model {
  static boot () {
    super.boot()
  }

  static get fields() {
    return {
      id: { label: 'ID' },
      user_id: { label: 'UserID' },
      token: { label: 'Token' },
      is_revoked: { label: 'IsRevoked' },
      created_at: { label: 'CreatedAt' },
      updated_at: { label: 'UpdatedAt' },
      deleted_at: { label: 'DeletedAt' }
    }
  }

  static get visible() {
    return [
      'id',
      'user_id',
      'token',
      'is_revoked',
      'created_at',
      'updated_at',
      'deleted_at'
    ]
  }

  static get filterable() {
    return [
      'id',
      'user_id'
    ]
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = AuthToken
