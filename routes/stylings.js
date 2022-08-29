import express from 'express'
import * as auth from '../middleware/auth.js'
import content from '../middleware/content.js'
import admin from '../middleware/admin.js'
import role from '../middleware/role.js'
import uploadStylings from '../middleware/uploadStylings.js'
import {
  createStylings,
  getMyStylings,
  getAllStylings,
  getStyling,
  deleteStyling,
  getStaffStylings
} from '../controllers/stylings.js'

const router = express.Router()

router.post('/', content('multipart/form-data'), auth.jwt, role(2), uploadStylings, createStylings)
router.get('/', auth.jwt, role(2), getMyStylings)
router.get('/all', getAllStylings)
router.get('/clerk/:id', getStaffStylings)
router.get('/:id', getStyling)
router.delete('/:id', auth.jwt, role(2), deleteStyling)

export default router
