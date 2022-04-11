'use strict'

/*
|--------------------------------------------------------------------------
| UserSeeder
|--------------------------------------------------------------------------
|
| Make use of the Factory instance to seed database with dummy data or
| make use of Lucid models directly.
|
*/

/** @type {import('@adonisjs/lucid/src/Factory')} */
const Factory = use('Factory')

class UserSeeder {
  async run () {
    const admin = {
      first_name: 'Sherpa',
      last_name: 'Brokers',
      username: 'sherpabrokers',
      email: 'dev.jessicaramsa@gmail.com',
      role_id: 1
    }

    const readuser = {
      first_name: 'Jéssica',
      last_name: 'Ramírez',
      username: 'jessicaramsa',
      email: 'jessicaramsa@gmail.com',
      role_id: 2
    }

    await Factory
      .model('App/Models/User')
      .create(admin)
    await Factory
      .model('App/Models/User')
      .create(readuser)
  }
}

module.exports = UserSeeder
