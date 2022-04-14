'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/**
*  @swagger
*  definitions:
*    Role:
*      type: object
*      properties:
*        id:
*          type: uint
*        name:
*          type: string
*      required:
*        - name
*/
class Role extends Model {
  static boot () {
    super.boot()
  }

  static get fields() {
    return {
      id: { label: 'ID' },
      name: { label: 'Name' },
      created_at: { label: 'CreatedAt' },
      updated_at: { label: 'UpdatedAt' },
      deleted_at: { label: 'DeletedAt' }
    }
  }

  static get visible() {
    return [
      'id',
      'name',
      'created_at',
      'updated_at',
      'deleted_at'
    ]
  }

  static get filterable() {
    return ['id']
  }

  static get searchable() {
    return ['name']
  }

  users () {
    return this.belongsToMany('App/Models/User')
  }
}

module.exports = Role
