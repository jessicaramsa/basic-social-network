'use strict'

const UserHook = exports = module.exports = {}

const Hash = use('Hash')

UserHook.encryptPassword = async (user) => {
  if (user.dirty.password) {
    user.password = await Hash.make(user.password)
  }
}
