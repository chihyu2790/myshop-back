import stores from '../models/stores.js'

export const createStores = async (req, res) => {
  try {
    await stores.create(req.body)
    res.status(200).send({ success: true, message: '' })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}

export const getAllStores = async (req, res) => {
  try {
    const result = await stores.find()
    res.status(200).send({ success: true, message: '', result })
  } catch (error) {
    res.status(500).send({ success: false, message: '伺服器錯誤' })
  }
}
