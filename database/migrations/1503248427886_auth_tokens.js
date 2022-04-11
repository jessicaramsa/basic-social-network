'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AuthTokensSchema extends Schema {
  up () {
    this.create('auth_tokens', (table) => {
      table.increments()

      table.integer('user_id').unsigned().notNullable()
      table.string('token').notNullable()
      table.boolean('is_revoked').defaultTo(false)

      table.timestamps()
      table.dateTime('deleted_at').nullable()
    })
  }

  down () {
    this.drop('auth_tokens')
  }
}

module.exports = AuthTokensSchema
