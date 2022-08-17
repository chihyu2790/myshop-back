import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  user: {
    type: mongoose.ObjectId,
    ref: 'users',
    required: [true, '缺少使用者欄位']
  },
  getway: {
    type: Number,
    required: [true, '缺少取貨方式']
  },
  getname: {
    type: String,
    required: [true, '缺少取貨人姓名欄位']

  },
  getphone: {
    type: String,
    required: [true, '缺少取貨人電話欄位']
  },
  getaddress: {
    type: String,
    required: [true, '缺少取貨人地址欄位']
  },
  getemail: {
    type: String,
    required: [true, '缺少取貨人信箱欄位']
  },
  products: [
    {
      product: {
        type: mongoose.ObjectId,
        ref: 'products',
        required: [true, '缺少商品欄位']
      },
      quantity: {
        type: Number,
        required: [true, '缺少數量欄位']
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
  ],
  date: {
    type: Date,
    default: Date.now()
  }
}, { versionKey: false })

export default mongoose.model('orders', schema)
