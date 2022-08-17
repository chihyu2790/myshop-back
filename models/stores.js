import mongoose from 'mongoose'

const schema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, '缺少店鋪名稱欄位']
  },
  phone: {
    type: String,
    required: [true, '缺少店鋪電話欄位']
  },
  address: {
    type: String,
    required: [true, '缺少店鋪地址欄位']
  },
  time: {
    type: String,
    required: [true, '缺少店鋪開門時間欄位']
  },
  sells: {
    type: String,
    required: [true, '缺少販售系列欄位']
  }
}, { versionKey: false })

export default mongoose.model('stores', schema)
