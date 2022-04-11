'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Multimedia extends Model {
  static boot () {
    super.boot()
  }

  static get fields() {
    return {
      id: { label: 'ID' },
      post_id: { label: 'PostID' },
      description: { label: 'Description' },
      created_at: { label: 'CreatedAt' },
      updated_at: { label: 'UpdatedAt' },
      deleted_at: { label: 'DeletedAt' }
    }
  }

  static get visible() {
    return [
      'id',
      'post_id',
      'description',
      'created_at',
      'updated_at',
      'deleted_at'
    ]
  }

  static get filterable() {
    return [
      'id',
      'post_id'
    ]
  }

  static get searchable() {
    return ['description']
  }

  post () {
    return this.belongsTo('App/Models/Post')
  }
}

module.exports = Multimedia
