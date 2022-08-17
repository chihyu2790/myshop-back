import users from '../models/users.js'
import orders from '../models/orders.js'

export const createOrder = async (req, res) => {
  try {
    console.log('req.body.getaddress' + req.body.getaddress)
    if (req.user.cart.length === 0) {
      return res.status(400).send({ success: false, message: '購物車為空' })
    }
    let result = await users.findById(req.user._id, 'cart').populate('cart.product')
    console.log('result' + result)
    const canCheckout = result.cart.every(item => item.product.sell)
    if (!canCheckout) {
      return res.status(400).send({ success: false, message: '包含下架商品' })
    }
    result = await orders.create({ user: req.user._id, products: req.user.cart, getway: req.body.getway, getname: req.body.getname, getphone: req.body.getphone, getaddress: req.body.getaddress, getemail: req.body.getemail })
    req.user.cart = []
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: result._id })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getOrder = async (req, res) => {
  try {
    const result = await orders.findById(req.params.id).populate('products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getMyOrders = async (req, res) => {
  try {
    const result = await orders.find({ user: req.user._id }).populate('products.product')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllOrders = async (req, res) => {
  try {
    // .populate('user', 'account')
    // 自動抓 user 欄位對應的 ref 資料，只取 account 欄位
    const result = await orders.find().populate('products.product').populate('user', 'account')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteOrder = async (req, res) => {
  try {
    await orders.findByIdAndDelete(req.params.id)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editOrder = async (req, res) => {
  try {
    await orders.findOneAndUpdate(
      { _id: req.params.id },
      {
        $set: {
          // $ 代表符合陣列搜尋條件的索引
          getname: req.body.getname,
          getaddress: req.body.getaddress,
          getemail: req.body.getemail,
          getphone: req.body.getphone,
          products: req.body.products
        }
      }
    )
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
