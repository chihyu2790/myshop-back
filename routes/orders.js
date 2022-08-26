import express from 'express'
import admin from '../middleware/admin.js'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import role from '../middleware/role.js'
import {
  createOrder,
  getMyOrders,
  getAllOrders,
  getOrder,
  deleteOrder,
  editOrder
} from '../controllers/orders.js'

const router = express.Router()

router.post('/', content('application/json'), auth.jwt, createOrder)
router.get('/', auth.jwt, getMyOrders)
router.get('/all', auth.jwt, admin, getAllOrders)
router.get('/:id', auth.jwt, getOrder)
router.delete('/:id', auth.jwt, admin, deleteOrder)
router.patch('/:id', content('application/json'), auth.jwt, admin, editOrder)

export default router
