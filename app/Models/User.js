'use strict'

/** @type {import('@adonisjs/framework/src/Hash')} */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class User extends Model {
  static boot () {
    super.boot()
    this.addHook('beforeSave', 'UserHook.encryptPassword')
  }

  static get fields() {
    return {
      id: { label: 'ID' },
      role_id: { label: 'RoleID' },
      first_name: { label: 'FirstName' },
      last_name: { label: 'LastName' },
      username: { label: 'Username' },
      email: { label: 'Email' },
      password: { label: 'Password' },
      created_at: { label: 'CreatedAt' },
      updated_at: { label: 'UpdatedAt' },
      deleted_at: { label: 'DeletedAt' }
    }
  }

  static get visible() {
    return [
      'id',
      'role_id',
      'first_name',
      'last_name',
      'username',
      'email',
      'password',
      'created_at',
      'updated_at',
      'deleted_at'
    ]
  }

  static get filterable() {
    return [
      'id',
      'role_id'
    ]
  }

  static get searchable() {
    return [
      'first_name',
      'last_name',
      'username',
      'email'
    ]
  }

  tokens () {
    return this.hasMany('App/Models/AuthToken')
  }

  posts () {
    return this.hasMany('App/Models/Post')
  }

  role () {
    return this.hasOne('App/Models/Role')
  }

  passwordRecoveryCodes () {
    return this.hasMany('App/Models/PasswordRecoveryCode')
  }
}

module.exports = User
