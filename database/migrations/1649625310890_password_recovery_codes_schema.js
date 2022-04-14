'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PasswordRecoveryCodesSchema extends Schema {
  up () {
    this.alter('password_recovery_codes', (table) => {
      table.boolean('is_revoked').defaultTo(0)
    })
  }

  down () {
    this.alter('password_recovery_codes', (table) => {
      table.dropColumn('is_revoked')
    })
  }
}

module.exports = PasswordRecoveryCodesSchema
