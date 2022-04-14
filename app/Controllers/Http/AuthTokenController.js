'use strict'

const moment = use('moment')
const Logger = use('Logger')
const Hash = use('Hash')

const User = use('App/Models/User')
const AuthToken = use('App/Models/AuthToken')
const ResourceController = use('App/Controllers/Http/ResourceController')

class AuthTokenController extends ResourceController {
  /**
  * @swagger
  * /login:
  *   post:
  *     tags:
  *       - Auth
  *     summary: Log in to the application
  *     parameters:
  *       - name: email
  *         description: Email of the user
  *         in: query
  *         required: true
  *         type: string
  *       - name: password
  *         description: Password of the user
  *         in: query
  *         required: true
  *         type: string
  *     responses:
  *       200:
  *         description: Send user information and authorization token
  *         example:
  *           code: 1
  *           message: Login successfully
  *           user:
  *             id: 1
  *             role_id: 1
  *             first_name: Sherpa
  *             last_name: Brokers
  *             username: sherpabrokers
  *             email: dev.sherpa@gmail.com
  *             password: encryptedpassword
  *             created_at: 2022-04-11 03:17:04
  *             updated_at: 2022-04-13 02:03:11
  *             deleted_at: null
  *           authToken: authtoken
  */
  async login({ response, auth, request }) {
    try {
      const { email, password } = request.only(['email', 'password'])
      let authToken = null

      if (!email || !password) {
        throw { code: 2, message: 'Email/Password required' }
      }

      const user = await User.query()
        .where('email', email)
        .first()

      if (!user) throw { code: 3, message: 'Invalid credentials' }

      const passwordMatch = await Hash.verify(password, user.password)
      if (!passwordMatch) throw { code: 3, message: 'Invalid credentials' }

      if (await auth.attempt(email, password)) {
        authToken = await auth.generate(user)
        return response.send({ code: 1, message: 'Login successfully', user, authToken: authToken.token })
      }
    } catch(err) {
      Logger.transport('file').error(`AuthTokenController.login - ${err.stack}`)
      Logger.transport('file').error(err)
      if (err.code) {
        return response.status(400).send({ message: err.message, code: err.code })
      }
      return response.status(400).send({ message: 'Something went wrong', code: 0 })
    }
  }

/**
  * @swagger
  * /logout:
  *   post:
  *     tags:
  *       - Auth
  *     summary: Log out from the application
  *     security:
  *       - bearerAuth: []
  *     responses:
  *       200:
  *         description: Send successful code and message
  *         example:
  *           code: 1
  *           message: Log out successfully
  */
  async logout({ response, request }) {
    try {
      const authHeader = request.header('Authorization') || ''
      let token = ''

      if (authHeader.toLowerCase().indexOf('bearer') >= 0) {
        token = (authHeader || '').substr(7)
      } else token = request.input('token') || ''

      const now = moment().format('YYYY-MM-DD HH:mm:ss')
      await AuthToken.query()
        .where('token', token)
        .update({ is_revoked: true, deleted_at: now })
    } catch(err) {
      Logger.transport('file').error(`AuthTokenController.logout - ${err.stack}`)
      Logger.transport('file').error(err)
    } finally {
      return response.send({ message: 'Log out successfully', code: 1 })
    }
  }
}

module.exports = AuthTokenController
