'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.on('/').render('welcome')

Route.get('/login', 'AuthTokenController.login')
Route.post('/logout', 'AuthTokenController.logout')
Route.post('/forgot-password', 'PasswordRecoveryCodeController.forgotPassword')

// General users
Route.group(() => {
  Route.get(':resource', 'UserController.index').as(':resource.index')
  Route.get(':resource', 'PostController.index').as(':resource.index')
}).middleware(['resource', 'auth']).prefix('api')

// Admin users
Route.group(() => {
  Route.resource(':resource', 'UserController').except(['index'])
  Route.resource(':resource', 'PostController').except(['index'])
}).middleware(['resource', 'auth', 'admin']).prefix('api')

Route.any('*', ({ response }) => {
  return response.status(404).json({ code: 404, message: 'Not found' })
})
