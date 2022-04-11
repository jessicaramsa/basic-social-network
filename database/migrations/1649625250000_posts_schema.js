'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class PostsSchema extends Schema {
  up () {
    this.create('posts', (table) => {
      table.increments()

      table.integer('user_id').unsigned().notNullable()
      table.string('title').notNullable()
      table.text('description').notNullable()
      table.integer('views').nullable().defaultTo(0)

      table.timestamps()
      table.dateTime('deleted_at').nullable()
    })
  }

  down () {
    this.drop('posts')
  }
}

module.exports = PostsSchema
