import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String
  },
  description: {
    type: String
  },
  staff: {
    type: mongoose.ObjectId,
    ref: 'staffs',
    required: [true, '缺少使用者欄位']
  },
  image: {
    type: String,
    default: '穿搭尚未選擇'
  },
  products: [
    {
      product: {
        type: mongoose.ObjectId,
        ref: 'products',
        required: [true, '缺少商品欄位']
      },
      color: {
        type: String,
        required: [true, '缺少數量欄位']
      },
      size: {
        type: String,
        required: [true, '缺少數量欄位']
      }
    }
  ]
}, { versionKey: false })

export default mongoose.model('stylings', schema)
