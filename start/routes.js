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

Route.post('/login', 'AuthTokenController.login')
Route.post('/logout', 'AuthTokenController.logout')
Route.post('/forgot-password', 'PasswordRecoveryCodeController.forgotPassword')
Route.post('/update-password', 'PasswordRecoveryCodeController.updatePassword')

// General users
Route.group(() => {
  Route.get('users', 'UserController.index').as('users.index')
  Route.get('posts', 'PostController.index').as('posts.index')
}).middleware(['auth']).prefix('api')

// Admin users
Route.group(() => {
  Route.post('users', 'UserController.store')
  Route.patch('users/:id', 'UserController.update')
  Route.delete('users/:id', 'UserController.destroy')

  Route.post('posts', 'PostController.store')
  Route.patch('posts/:id', 'PostController.update')
  Route.delete('posts/:id', 'PostController.destroy')
}).middleware(['auth', 'admin']).prefix('api')

Route.any('*', ({ response }) => {
  return response.status(404).json({ code: 404, message: 'Not found' })
})
