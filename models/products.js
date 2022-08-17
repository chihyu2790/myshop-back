import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少名稱欄位']
  },
  price: {
    type: Number,
    min: [0, '價格格式錯誤'],
    required: [true, '缺少價格欄位']
  },
  description: {
    type: String
  },
  image: {
    type: [String]
  },
  color: {
    type: [String]
  },
  size: {
    type: [String]
  },
  classify: {
    type: [String]
  },
  sell: {
    type: Boolean,
    default: false
  },
  category: {
    type: String,
    // required: [true, '缺少分類欄位'],
    enum: {
      values: ['衣服', '包包'],
      message: '商品分類錯誤'
    }
  }
}, { versionKey: false })

export default mongoose.model('products', schema)
