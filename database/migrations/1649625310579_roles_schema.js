'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class RolesSchema extends Schema {
  up () {
    this.create('roles', (table) => {
      table.increments()

      table.string('name', 50).nullable().unique()

      table.timestamps()
      table.dateTime('deleted_at').nullable()
    })
  }

  down () {
    this.drop('roles')
  }
}

module.exports = RolesSchema
