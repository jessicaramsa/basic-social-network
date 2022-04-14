'use strict'

const moment = use('moment')
const Logger = use('Logger')
const Mail = use('Mail')
const Config = use('Config')
const Hash = use('Hash')

const User = use('App/Models/User')
const PasswordRecoveryCode = use('App/Models/PasswordRecoveryCode')
const ResourceController = use('App/Controllers/Http/ResourceController')

class PasswordRecoveryCodeController extends ResourceController {
  async generateCode(length) {
    const possible = '0123456789'
    let text = ''
    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
  }

  /**
  * @swagger
  * /forgot-password:
  *   post:
  *     tags:
  *       - Auth
  *     summary: Request a password recovery code
  *     consumes:
  *       - application/json
  *     parameters:
  *       - in: body
  *         name: post
  *         description: The post to create
  *         schema:
  *           type: object
  *           required:
  *             - email
  *           properties:
  *             email:
  *               type: string
  *     responses:
  *       200:
  *         description: Send successful message
  *         example:
  *           code: 1
  *           message: Email sent to user
  */
  async forgotPassword({ request, response }) {
    try {
      const { email } = request.only(['email'])
      if (!email) {
        throw { code: 2, message: 'Email required' }
      }

      const user = await User.query()
        .where('email', email)
        .first()
      if (!user) {
        throw { code: 3, message: 'User not found' }
      }

      await PasswordRecoveryCode.query()
        .where('user_id', user.id)
        .update({ is_revoked: 1 })

      const generatedCode = await this.generateCode(4)
      const chance = await PasswordRecoveryCode.create({
        'user_id': user.id,
        'code': generatedCode,
        'expiration_date': moment().add(1, 'M').format('YYYY-MM-DD')
      })

      const code = chance.code.split('')
      const mail = {
        c1: code[0],
        c2: code[1],
        c3: code[2],
        c4: code[3]
      }
      await Mail.connection('smtp')
        .send('recovery_password', mail, (message) => {
          message
            .to(email)
            .from(Config.get('mail.from'), 'Jéssica Ramírez')
            .subject('Password recovery code')
        })

      return response.json({ message: 'Email sent to user', code: 1 })
    } catch(err) {
      Logger.transport('file').error(`PasswordRecoveryCodeController.forgotPassword - ${err.stack}`)
      Logger.transport('file').error(err)
      if (err.code) {
        return response.status(400).send({ message: err.message, code: err.code })
      }
      return response.status(400).send({ message: 'Something went wrong', code: 0 })
    }
  }

  /**
  * @swagger
  * /update-password:
  *   post:
  *     tags:
  *       - Auth
  *     summary: Update password
  *     consumes:
  *       - text/plain
  *     parameters:
  *       - in: body
  *         name: post
  *         description: The post to create
  *         schema:
  *           type: object
  *           required:
  *             - email
  *             - code
  *             - password
  *           properties:
  *             email:
  *               type: string
  *             code:
  *               type: string
  *             password:
  *               type: string
  *     responses:
  *       200:
  *         description: Send successful message
  *         example:
  *           code: 1
  *           message: Password updated successfully
  */
  async updatePassword({ request, response }) {
    try {
      const { code, password, email } = request.only(['code', 'password', 'email'])

      if (!code) throw { code: 2, message: 'Parameter code required' }
      if (!password) throw { code: 2, message: 'Parameter password required' }
      if (!email) throw { code: 2, message: 'Parameter email required' }

      const user = await User.query()
        .where('email', email)
        .first()

      if (!user) throw { code: 3, message: 'User not found' }

      const isValid = await PasswordRecoveryCode.query()
        .where('user_id', user.id)
        .where('code', code)
        .where('is_revoked', 0)
        .first()

      if (!isValid) throw { code: 4, message: 'Password recovery code not valid' }

      user.password = password
      await user.save()

      isValid.is_revoked = 1
      await isValid.save()

      return response.json({ code: 1, message: 'Password updated successfully' })
    } catch(err) {
      Logger.transport('file').error(`PasswordRecoveryCodeController.forgotPassword - ${err.stack}`)
      Logger.transport('file').error(err)
      if (err.code) {
        return response.status(400).send({ message: err.message, code: err.code })
      }
      return response.status(400).send({ message: 'Something went wrong', code: 0 })
    }
  }
}

module.exports = PasswordRecoveryCodeController
