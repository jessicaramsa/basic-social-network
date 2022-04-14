'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PasswordRecoveryCodesSchema extends Schema {
  up () {
    this.create('password_recovery_codes', (table) => {
      table.increments()

      table.integer('user_id').unsigned().notNullable()
      table.string('code').notNullable()
      table.dateTime('expiration_date').notNullable()

      table.timestamps()
      table.dateTime('deleted_at').nullable()
    })
  }

  down () {
    this.drop('password_recovery_codes')
  }
}

module.exports = PasswordRecoveryCodesSchema
