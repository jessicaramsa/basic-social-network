'use strict'

const Logger = use('Logger')

class ResourceController {
  /**
   * Show a list of all resources.
   * GET resources
   */
  async index({ request, response, view, params, Model, auth }) {
    try {
      const all = request.all()
      let data = Model.query()

      const searchableFields = Model.searchable
      const isSearchableObject = typeof all.search === Object
      if (all.search && searchableFields && isSearchableObject) {
        for (let key in all.search) {
          data = data.where(key, 'like', `%${all.search[key]}%`)
        }
      }

      // include relations

      const page = all.page || 1
      const perPage = all.perPage || 10
      return await data.paginate(page, perPage)
    } catch(err) {
      Logger.transport('file').error(`ResourceController.index - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  /**
   * Create/save a new resource.
   * POST resources
   */
  async store({ request, response, Model }) {
    try {
      const model = await Model.create(request.all())
      return model
    } catch(err) {
      Logger.transport('file').error(`ResourceController.store - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  /**
   * Update resource details.
   * PUT or PATCH resources/:id
   */
  async update({ params, request, response, Model, model }) {
    try {
      model.fill(request.all())
      await model.save()
      return model
    } catch(err) {
      Logger.transport('file').error(`ResourceController.update - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  /**
   * Delete a resource with id.
   * DELETE resources/:id
   */
  async destroy({ params, request, response, Model, model }) {
    try {
      await model.delete()
      return {}
    } catch(err) {
      Logger.transport('file').error(`ResourceController.destroy - ${err.stack}`)
      Logger.transport('file').error(err)
      return this.returnError(response, err.stack, 400)
    }
  }

  async returnError(response, message, code) {
    return response.status(code).send({ message })
  }
}

module.exports = ResourceController
