import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import role from '../middleware/role.js'
import {
  register,
  login,
  logout,
  extend,
  getUser,
  editUser,
  editUsers,
  addCart,
  editCart,
  getCart,
  deleteUser,
  getAllUsers,
  editItemsCart
} from '../controllers/users.js'

const router = express.Router()

router.post('/', content('application/json'), register)
router.post('/login', content('application/json'), auth.login, login)
router.delete('/logout', auth.jwt, logout)
router.post('/extend', auth.jwt, extend)
router.get('/', auth.jwt, getUser)
router.patch('/', content('application/json'), auth.jwt, editUser)
router.patch('/:id', content('application/json'), auth.jwt, admin, editUsers)
router.get('/all', auth.jwt, admin, getAllUsers)
router.delete('/:id', auth.jwt, admin, deleteUser)
router.post('/cart', content('application/json'), auth.jwt, addCart)
router.patch('/cart', content('application/json'), auth.jwt, editCart)
router.patch('/cartitems', content('application/json'), auth.jwt, editItemsCart)
router.get('/cart', auth.jwt, getCart)
export default router
