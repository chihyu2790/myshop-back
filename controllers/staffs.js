import staffs from '../models/staffs.js'

export const getMyStaff = async (req, res) => {
  try {
    res.status(200).send({
      success: true,
      message: '',
      result: {
        account: req.user.account,
        email: req.user.email,
        role: req.user.role,
        name: req.user.name,
        sex: req.user.sex,
        avatar: req.user.avatar,
        description: req.user.description,
        height: req.user.height,
        stores: req.user.stores
      }
    })
    // const result = await staffs.find({ user: req.user._id }).populate('stores')
    // res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getStaff = async (req, res) => {
  try {
    const result = await staffs.findById(req.params.id).populate('stores')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getStaffInfo = async (req, res) => {
  try {
    const result = await staffs.findById(req.params.id).populate('stores')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllStaffs = async (req, res) => {
  try {
    const result = await staffs.find().populate('stores')
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editStaff = async (req, res) => {
  try {
    const data = {
      name: req.body.name,
      sex: req.body.sex,
      description: req.body.description,
      height: req.body.height,
      stores: req.body.stores
    }
    if (req.file) data.avatar = req.file.path
    const result = await staffs.findByIdAndUpdate(req.user._id, data, { new: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getCart = async (req, res) => {
  try {
    const result = await staffs.findById(req.user._id, 'cart').populate('cart.product')
    res.status(200).send({ success: true, message: '', result: result.cart })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const deleteCart = async (req, res) => {
  try {
    await staffs.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          cart: []
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
