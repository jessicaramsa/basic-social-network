'use strict'

const moment = use('moment')
const Logger = use('Logger')
const Mail = use('Mail')
const Config = use('Config')

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

      const generatedCode = await this.generateCode(4)
      const chance = await PasswordRecoveryCode.create({
        'user_id': user.id,
        'code': generatedCode,
        'expiration_date': moment().add(1, 'M').format('YYYY-MM-DD')
      })

      await PasswordRecoveryCode.query()
        .whereNot('code', chance.id)
        .delete()

      const code = chance.code.split('')
      const mail = { code }
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
}

module.exports = PasswordRecoveryCodeController
