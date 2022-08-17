import users from '../models/users.js'
import stylings from '../models/stylings.js'

export const createStylings = async (req, res) => {
  try {
    // const canCheckout = result.cart.every(item => item.product.sell)
    // if (!canCheckout) {
    //   return res.status(400).send({ success: false, message: '包含下架商品' })
    // }
    const result = await stylings.create({ staff: req.user._id, image: req.file.path, products: req.user.cart })
    req.user.cart = []
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: result._id })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getStyling = async (req, res) => {
  try {
    const result = await stylings.findById(req.params.id).populate('products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getMyStylings = async (req, res) => {
  try {
    const result = await stylings.find({ staff: req.user._id }).populate('products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllStylings = async (req, res) => {
  try {
    // .populate('user', 'account')
    // 自動抓 user 欄位對應的 ref 資料，只取 account 欄位
    const result = await stylings.find().populate('products.product').populate('staff', 'account')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteStyling = async (req, res) => {
  try {
    await stylings.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
