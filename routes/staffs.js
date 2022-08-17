import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import role from '../middleware/role.js'
import upload from '../middleware/upload.js'
import uploadSingle from '../middleware/uploadSingle.js'
import {
  getStaff,
  getMyStaff,
  getAllStaffs,
  editStaff,
  getCart,
  getStaffInfo,
  deleteCart
} from '../controllers/staffs.js'

const router = express.Router()

router.get('/', auth.jwt, getMyStaff)
router.get('/cart', auth.jwt, getCart)
router.get('/info/:id', getStaffInfo)
router.get('/:id', auth.jwt, getStaff)
router.get('/all', auth.jwt, admin, getAllStaffs)
router.patch('/', content('multipart/form-data'), auth.jwt, uploadSingle, editStaff)
router.patch('/delete', auth.jwt, deleteCart)
export default router
