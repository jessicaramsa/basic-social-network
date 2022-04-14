'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

/**
*  @swagger
*  definitions:
*    Post:
*      type: object
*      properties:
*        id:
*          type: uint
*        user_id:
*          type: uint
*        title:
*          type: string
*        description:
*          type: string
*        views:
*          type: int
*      required:
*        - user_id
*        - title
*        - description
*/
class Post extends Model {
  static boot () {
    super.boot()
    this.addHook('afterPaginate', 'PostHook.incrementViews')
    this.addHook('afterFetch', 'PostHook.incrementViews')
  }

  static get fields() {
    return {
      id: { label: 'ID' },
      user_id: { label: 'UserID' },
      title: { label: 'Title' },
      description: { label: 'Description' },
      views: { label: 'Views' },
      created_at: { label: 'CreatedAt' },
      updated_at: { label: 'UpdatedAt' },
      deleted_at: { label: 'DeletedAt' }
    }
  }

  static get visible() {
    return [
      'id',
      'user_id',
      'title',
      'description',
      'views',
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
    return [
      'title',
      'description'
    ]
  }

  user () {
    return this.belongsTo('App/Models/User')
  }

  multimedias () {
    return this.hasMany('App/Models/Multimedia')
  }
}

module.exports = Post
