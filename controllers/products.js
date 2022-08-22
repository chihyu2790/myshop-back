import products from '../models/products.js'

export const createProduct = async (req, res) => {
  try {
    console.log(req.files)
    const result = await products.create({
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      image: req.files?.map(file => {
        return file.path
      }) || [],
      color: req.body.color,
      size: req.body.size,
      sell: req.body.sell,
      classify: req.body.classify
      // category: req.body.category
    })
    res.status(200).send({ success: true, message: '', result })
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

export const getProducts = async (req, res) => {
  try {
    const result = await products.find({ sell: true })
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllProducts = async (req, res) => {
  try {
    const result = await products.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getProduct = async (req, res) => {
  try {
    const result = await products.findById(req.params.id)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getTypeProducts = async (req, res) => {
  try {
    const result = await products.find({ classify: req.body.classify, sell: true })
    console.log(result)
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const editProduct = async (req, res) => {
  try {
    // await products.findOneAndUpdate(
    //   { _id: req.params.id },
    //   {
    //     $set: {
    //       image: []
    //     }
    //   }, { new: true })
    const data = {
      name: req.body.name,
      price: req.body.price,
      description: req.body.description,
      sell: req.body.sell,
      // image: req.files?.map(file => {
      //   return file.path
      // }) || [],
      category: req.body.category,
      color: req.body.color,
      size: req.body.size,
      classify: req.body.classify
    }
    // if (req.files) data.image = req.file.path
    const result = await products.findByIdAndUpdate(req.params.id, data, { new: true })
    res.status(200).send({ success: true, message: '', result })
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
