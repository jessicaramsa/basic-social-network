'use strict'

const Logger = use('Logger')

const User = use('App/Models/User')

class UserController {
/**
  * @swagger
  * /api/users:
  *   get:
  *     tags:
  *       - Users
  *     summary: Retrieve created users
  *     security:
  *       - bearerAuth: []
  *     parameters:
  *       - name: search
  *         in: query
  *         description: Text to filter search
  *         required: false
  *         schema:
  *           type: object
  *           properties:
  *             first_name:
  *               type: string
  *             last_name:
  *               type: string
  *             username:
  *               type: string
  *             email:
  *               type: string
  *           example:
  *             first_name: firstname
  *             last_name: lastname
  *             username: username
  *             email: email
  *           style: form
  *           explode: true
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
  *         description: Send users information
  *         example:
  *           code: 1
  *           message: Users found successfully
  *           total: 1
  *           page: 1
  *           perPage: 10
  *           lastPage: 1
  *           data:
  *             - id: 1
  *               role_id: 1
  *               first_name: Sherpa
  *               last_name: Brokers
  *               username: sherpabrokers
  *               email: dev@sherpabrokers.com
  *               password: sherpa.brokers.pwd
  *               created_at: 2022-04-11 12:17:04
  *               updated_at: 2022-04-13 13:03:11
  *               deleted_at: null
  */
  async index({ request, response }) {
    try {
      const all = request.all()
      let data = User.query()

      const searchableFields = User.searchable
      const isSearchableObject = typeof all.search === Object
      if (all.search && searchableFields && isSearchableObject) {
        for (let key in all.search) {
          data = data.where(key, 'like', `%${all.search[key]}%`)
        }
      }

      const page = all.page || 1
      const perPage = all.perPage || 10
      const users = await data.paginate(page, perPage)
      return response.json({ code: 1, message: 'Users found successfully', ...users })
    } catch(err) {
      Logger.transport('file').error(`UserController.index - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  /**
  * @swagger
  * /api/users:
  *   post:
  *     tags:
  *       - Users
  *     summary: Create a single user
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - text/plain
  *     parameters:
  *       - in: body
  *         name: user
  *         description: The user to create
  *         schema:
  *           type: object
  *           required:
  *             - role_id
  *             - first_name
  *             - last_name
  *             - username
  *             - email
  *             - password
  *           properties:
  *             role_id:
  *               type: integer
  *             first_name:
  *               type: string
  *             last_name:
  *               type: string
  *             username:
  *               type: string
  *             email:
  *               type: string
  *             password:
  *               type: string
  *     responses:
  *       200:
  *         description: Send successful message and user information
  *         example:
  *           code: 1
  *           message: User created successfully
  *           data:
  *             id: 1
  *             role_id: 1
  *             first_name: Sherpa
  *             last_name: Brokers
  *             username: sherpabrokers
  *             email: dev@sherpabrokers.com
  *             password: sherpa.brokers.pwd
  *             created_at: 2022-04-11 12:17:04
  *             updated_at: 2022-04-13 13:03:11
  *             deleted_at: null
  */
  async store({ request, response }) {
    try {
      const user = await User.create(request.all())
      return response.json({ code: 1, message: 'User created successfully', user })
    } catch(err) {
      Logger.transport('file').error(`UserController.store - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  /**
  * @swagger
  * /api/users/{id}:
  *   patch:
  *     tags:
  *       - Users
  *     summary: Update a single user
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - text/plain
  *     parameters:
  *       - in: path
  *         name: id
  *         description: User ID
  *         required: true
  *         type: integer
  *       - in: body
  *         name: user
  *         description: The user to update
  *         schema:
  *           type: object
  *           properties:
  *             first_name:
  *               type: string
  *             last_name:
  *               type: string
  *             username:
  *               type: string
  *             email:
  *               type: string
  *     responses:
  *       200:
  *         description: Send successful message and user information
  *         example:
  *           code: 1
  *           message: User updated successfully
  *           data:
  *             id: 1
  *             role_id: 1
  *             first_name: Sherpa
  *             last_name: Brokers
  *             username: sherpabrokers
  *             email: dev@sherpabrokers.com
  *             password: sherpa.brokers.pwd
  *             created_at: 2022-04-11 12:17:04
  *             updated_at: 2022-04-13 13:03:11
  *             deleted_at: null
  */
  async update({ params, request, response,}) {
    try {
      const user = await User.find(params.id)
      const { first_name, last_name, username, email } = request.only(['first_name', 'last_name', 'username', 'email'])

      if (first_name) user.first_name = first_name
      if (last_name) user.last_name = last_name
      if (username) user.username = username
      if (email) user.email = email

      await user.save()
      return response.json({ code: 1, message: 'User updated successfully', user })
    } catch(err) {
      Logger.transport('file').error(`UserController.update - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  /**
  * @swagger
  * /api/users/{id}:
  *   delete:
  *     tags:
  *       - Users
  *     summary: Delete a single user
  *     security:
  *       - bearerAuth: []
  *     consumes:
  *       - text/plain
  *     parameters:
  *       - in: path
  *         name: id
  *         description: User ID
  *         required: true
  *         type: integer
  *     responses:
  *       200:
  *         description: Send successful message
  *         example:
  *           code: 1
  *           message: Users deleted successfully
  */
  async destroy({ params, request, response }) {
    try {
      const user = await User.find(params.id)
      await user.delete()
      return response.json({ code: 1, message: 'User deleted successfully' })
    } catch(err) {
      Logger.transport('file').error(`UserController.destroy - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  async returnError(response, message, code) {
    return response.status(code).send({ message })
  }
}

module.exports = UserController
