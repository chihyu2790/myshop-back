import express from 'express'
import admin from '../middleware/admin.js'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import role from '../middleware/role.js'
import {
  getAllStores,
  createStores,
  editStore,
  deleteStore
} from '../controllers/stores.js'

const router = express.Router()

router.post('/', content('application/json'), auth.jwt, createStores)
router.get('/', getAllStores)
router.delete('/:id', auth.jwt, admin, deleteStore)
router.patch('/:id', content('application/json'), auth.jwt, admin, editStore)
export default router
