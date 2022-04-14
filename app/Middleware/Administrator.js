'use strict'

const Role = use('App/Models/Role')

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

class Administrator {
  /**
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Function} next
   */
  async handle ({ response, request, auth }, next) {
    const userInfo = auth.user

    const userRole = await Role.query()
      .where('id', userInfo.role_id)
      .first()

    if (!userRole || userRole.name !== 'admin') {
      return response.status(401).json({ code: 0, message: 'The User does not have enough permissions' })
    }

    await next()
  }
}

module.exports = Administrator
