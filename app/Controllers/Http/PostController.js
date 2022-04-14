'use strict'

const Logger = use('Logger')

const Post = use('App/Models/Post')

class PostController {
  /**
  * @swagger
  * /api/posts:
  *   get:
  *     tags:
  *       - Posts
  *     summary: Retrieve created posts
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - name: search
  *         description: Text to filter search
  *         in: query
  *         required: false
  *         type: string
  *       - name: page
  *         description: Number of the current page
  *         in: query
  *         required: false
  *         type: integer
  *       - name: perPage
  *         description: Quantity of rows per page
  *         in: query
  *         required: false
  *         type: integer
  *     responses:
  *       200:
  *         description: Send posts information
  *         example:
  *           code: 1
  *           message: Posts found successfully
  *           total: 1
  *           page: 1
  *           perPage: 10
  *           lastPage: 1
  *           data:
  *             - id: 1
  *               user_id: 1
  *               title: Test
  *               description: Post to test the API
  *               views: 6
  *               created_at: 2022-04-11 12:17:04
  *               updated_at: 2022-04-13 13:03:11
  *               deleted_at: null
  */
  async index({ request, response }) {
    try {
      const all = request.all()
      let data = Post.query()
        .with('media')

      const searchableFields = Post.searchable
      const isSearchableObject = typeof all.search === Object
      if (all.search && searchableFields && isSearchableObject) {
        for (let key in all.search) {
          data = data.where(key, 'like', `%${all.search[key]}%`)
        }
      }

      const page = all.page || 1
      const perPage = all.perPage || 10
      const posts = await data.paginate(page, perPage)
      return response.json({ code: 1, message: 'Posts found successfully', ...posts })
    } catch(err) {
      Logger.transport('file').error(`PostController.index - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  /**
  * @swagger
  * /api/posts:
  *   post:
  *     tags:
  *       - Posts
  *     summary: Create a single post
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - text/plain
  *     parameters:
  *       - in: body
  *         name: post
  *         description: The post to create
  *         schema:
  *           type: object
  *           required:
  *             - user_id
  *             - title
  *             - description
  *           properties:
  *             user_id:
  *               type: integer
  *             title:
  *               type: string
  *             description:
  *               type: string
  *     responses:
  *       200:
  *         description: Send successful message and post information
  *         example:
  *           code: 1
  *           message: Post created successfully
  *           data:
  *             id: 1
  *             user_id: 1
  *             title: Test
  *             description: Post to test the API
  *             views: 0
  *             created_at: 2022-04-11 12:17:04
  *             updated_at: 2022-04-13 13:03:11
  *             deleted_at: null
  */
  async store({ request, response }) {
    try {
      const post = await Post.create(request.all())
      return response.json({ code: 1, message: 'Post created successfully', post })
    } catch(err) {
      Logger.transport('file').error(`PostController.store - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  /**
  * @swagger
  * /api/posts/{id}:
  *   patch:
  *     tags:
  *       - Posts
  *     summary: Update a single post
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - text/plain
  *     parameters:
  *       - in: path
  *         name: id
  *         description: Post ID
  *         required: true
  *         type: integer
  *       - in: body
  *         name: post
  *         description: The post to update
  *         schema:
  *           type: object
  *           required:
  *             - title
  *             - description
  *           properties:
  *             title:
  *               type: string
  *             description:
  *               type: string
  *     responses:
  *       200:
  *         description: Send successful message and post information
  *         example:
  *           code: 1
  *           message: Post updated successfully
  *           data:
  *             id: 1
  *             user_id: 1
  *             title: Test
  *             description: Post to test the API
  *             views: 0
  *             created_at: 2022-04-11 12:17:04
  *             updated_at: 2022-04-13 13:03:11
  *             deleted_at: null
  */
  async update({ params, request, response,}) {
    try {
      const post = await Post.find(params.id)
      post.title = request.input('title')
      post.description = request.input('description')

      await post.save()
      return response.json({ code: 1, message: 'Post updated successfully', post })
    } catch(err) {
      Logger.transport('file').error(`PostController.update - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  /**
  * @swagger
  * /api/posts/{id}:
  *   delete:
  *     tags:
  *       - Posts
  *     summary: Delete a single post
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - text/plain
  *     parameters:
  *       - in: path
  *         name: id
  *         description: Post ID
  *         required: true
  *         type: integer
  *     responses:
  *       200:
  *         description: Send successful message
  *         example:
  *           code: 1
  *           message: Posts deleted successfully
  */
  async destroy({ params, request, response }) {
    try {
      const post = await Post.find(params.id)
      await post.delete()
      return response.json({ code: 1, message: 'Post deleted successfully' })
    } catch(err) {
      Logger.transport('file').error(`PostController.destroy - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  async returnError(response, message, code) {
    return response.status(code).send({ message })
  }
}

module.exports = PostController
