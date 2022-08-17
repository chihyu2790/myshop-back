import mongoose from 'mongoose'
import validator from 'validator'

const schema = new mongoose.Schema({
  account: {
    type: String,
    required: [true, '缺少帳號欄位'],
    minlength: [4, '帳號必須 4 個字以上'],
    maxlength: [20, '帳號必須 20 個字以下'],
    unique: true,
    match: [/^[A-Za-z0-9]+$/, '帳號格式錯誤']
  },
  password: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: [true, '缺少信箱欄位'],
    unique: true,
    validate: {
      validator(email) {
        return validator.isEmail(email)
      },
      message: '信箱格式錯誤'
    }
  },
  tokens: {
    type: [String]
  },
  cart: {
    type: [
      {
        product: {
          type: mongoose.ObjectId,
          ref: 'products',
          required: [true, '缺少商品欄位']
        },
        quantity: {
          type: Number,
          required: [true, '缺少數量欄位']
        }
      }
    ]
  },
  role: {
    // 0 = 使用者
    // 1 = 管理員
    type: Number,
    default: 0
  }
}, { versionKey: false })

export default mongoose.model('admins', schema)
