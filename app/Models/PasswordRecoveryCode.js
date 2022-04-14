'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/**
*  @swagger
*  definitions:
*    PasswordRecoveryCode:
*      type: object
*      properties:
*        id:
*          type: uint
*        user_id:
*          type: uint
*        code:
*          type: string
*        expiration_date:
*          type: string
*      required:
*        - user_id
*        - code
*/
class PasswordRecoveryCode extends Model {
  static boot () {
    super.boot()
  }

  static get fields() {
    return {
      id: { label: 'ID' },
      user_id: { label: 'UserID' },
      code: { label: 'Code' },
      expiration_date: { label: 'ExpirationDate' },
      created_at: { label: 'CreatedAt' },
      updated_at: { label: 'UpdatedAt' },
      deleted_at: { label: 'DeletedAt' }
    }
  }

  static get visible() {
    return [
      'id',
      'user_id',
      'code',
      'expiration_date',
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

  static get searchable() {
    return ['code']
  }

  user () {
    return this.belongsTo('App/Models/User')
  }
}

module.exports = PasswordRecoveryCode
