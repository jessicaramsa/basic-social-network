'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class MultimediasSchema extends Schema {
  up () {
    this.create('multimedias', (table) => {
      table.increments()

      table.integer('post_id').unsigned().notNullable()
      table.text('description').notNullable()

      table.timestamps()
      table.dateTime('deleted_at').nullable()
    })
  }

  down () {
    this.drop('multimedias')
  }
}

module.exports = MultimediasSchema
