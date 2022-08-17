import users from '../models/users.js'
// import admins from '../models/admins.js'
import staffs from '../models/staffs.js'
import products from '../models/products.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import orders from '../models/orders.js'

export const register = async (req, res) => {
  const password = req.body.password
  if (!password) {
    return res.status(400).send({ success: false, message: '缺少密碼欄位' })
  }
  if (password.length < 4) {
    return res.status(400).send({ success: false, message: '密碼必須 4 個字以上' })
  }
  if (password.length > 20) {
    return res.status(400).send({ success: false, message: '密碼必須 20 個字以下' })
  }
  if (!password.match(/^[A-Za-z0-9]+$/)) {
    return res.status(400).send({ success: false, message: '密碼格式錯誤' })
  }
  req.body.password = bcrypt.hashSync(password, 10)
  try {
    await users.create(req.body)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else if (error.name === 'MongoServerError' && error.code === 11000) {
      res.status(400).send({ success: false, message: '帳號已存在' })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const login = async (req, res) => {
  console.log('this is controller login')
  try {
    const token = jwt.sign({ _id: req.user._id, role: req.user.role }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens.push(token)
    await req.user.save()
    res.status(200).send({
      success: true,
      message: '',
      result: {
        token,
        account: req.user.account,
        email: req.user.email,
        cart: req.user.cart.length,
        role: req.user.role
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const logout = async (req, res) => {
  try {
    req.user.tokens = req.user.tokens.filter(token => token !== req.token)
    await req.user.save()
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const extend = async (req, res) => {
  try {
    const idx = req.user.tokens.findIndex(token => token === req.token)
    const token = jwt.sign({ _id: req.user._id }, process.env.SECRET, { expiresIn: '7 days' })
    req.user.tokens[idx] = token
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: token })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getUser = (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        cart: req.user.cart.length,
        role: req.user.role,
        name: req.user.name,
        sex: req.user.sex,
        birthday: req.user.birthday,
        address: req.user.address,
        phone: req.user.phone
      }
    })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllUsers = async (req, res) => {
  try {
    const result = await users.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteUser = async (req, res) => {
  try {
    await users.findByIdAndDelete(req.params.id)
    await orders.deleteMany({ user: req.params.id })
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const addCart = async (req, res) => {
  try {
    // 驗證商品
    const result = await products.findById(req.body.product)
    // 沒找到或已下架
    if (!result || !result.sell) {
      return res.status(404).send({ success: false, message: '商品不存在' })
    }
    console.log(req.body)
    // 找購物車有沒有這個商品
    const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product && item.color.toString() === req.body.color && item.size.toString() === req.body.size)
    if (idx > -1) {
      console.log(typeof (req.body.quantity))
      console.log(typeof (req.user.cart[idx].quantity))
      req.user.cart[idx].quantity += req.body.quantity
    } else {
      req.user.cart.push({
        product: req.body.product,
        quantity: req.body.quantity,
        color: req.body.color,
        size: req.body.size
      })
    }
    await req.user.save()
    res.status(200).send({ success: true, message: '', result: req.user.cart.length })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const editUser = async (req, res) => {
  try {
    await users.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          // $ 代表符合陣列搜尋條件的索引
          name: req.body.name,
          sex: req.body.sex,
          birthday: req.body.birthday,
          address: req.body.address,
          phone: req.body.phone,
          email: req.body.email
        }
      }
    )
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editItemsCart = async (req, res) => {
  try {
    await users.findOneAndUpdate(
      { _id: req.user._id, 'cart.product': req.body.product, 'cart.color': req.body.color, 'cart.size': req.body.size },
      {
        $pull: {
          cart: { product: req.body.product, color: req.body.color, size: req.body.size }
        }
      }
    )
    // const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
    // req.user.cart[idx].quantity = req.body.quantity
    // await req.user.save()

    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const editCart = async (req, res) => {
  try {
    if (req.body.quantity <= 0) {
      await users.findOneAndUpdate(
        { _id: req.user._id, 'cart.product': req.body.product },
        {
          $pull: {
            cart: { product: req.body.product }
          }
        }
      )
      // const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      // req.user.cart.splice(idx, 1)
      // await req.user.save()
    } else {
      await users.findOneAndUpdate(
        { _id: req.user._id, 'cart.product': req.body.product },
        {
          $set: {
            // $ 代表符合陣列搜尋條件的索引
            'cart.$.quantity': req.body.quantity
          }
        }
      )
      // const idx = req.user.cart.findIndex(item => item.product.toString() === req.body.product)
      // req.user.cart[idx].quantity = req.body.quantity
      // await req.user.save()
    }
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    if (error.name === 'ValidationError') {
      const key = Object.keys(error.errors)[0]
      const message = error.errors[key].message
      return res.status(400).send({ success: false, message })
    } else {
      res.status(500).send({ success: false, message: '伺服器錯誤' })
    }
  }
}

export const getCart = async (req, res) => {
  try {
    const result = await users.findById(req.user._id, 'cart').populate('cart.product')
    res.status(200).send({ success: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
