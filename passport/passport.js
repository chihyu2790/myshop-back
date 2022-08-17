import passport from 'passport'
import passportJWT from 'passport-jwt'
import passportLocal from 'passport-local'
import bcrypt from 'bcrypt'
import users from '../models/users.js'
import admins from '../models/admins.js'
import staffs from '../models/staffs.js'

const LocalStrategy = passportLocal.Strategy
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

passport.use('login', new LocalStrategy({
  usernameField: 'account',
  passwordField: 'password',
  passReqToCallback: true
}, async (req, account, password, done) => {
  try {
    let user
    if (req.body.role === 0) {
      user = await users.findOne({ account })
      console.log('user-way')
    }
    if (req.body.role === 1) {
      user = await admins.findOne({ account })
      console.log('admin-way')
    }
    if (req.body.role === 2) {
      user = await staffs.findOne({ account })
      console.log('staff-way')
    }
    if (!user) {
      return done(null, false, { message: '帳號不存在' })
    }
    if (!bcrypt.compareSync(password, user.password)) {
      return done(null, false, { message: '密碼錯誤' })
    }
    return done(null, user)
  } catch (error) {
    return done(error, false)
  }
}))

passport.use('jwt', new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET,
  passReqToCallback: true,
  ignoreExpiration: true
}, async (req, payload, done) => {
  const expired = payload.exp * 1000 < Date.now()
  if (expired && req.originalUrl !== '/users/extend' && req.originalUrl !== '/users/logout') {
    return done(null, false, { message: '登入逾期' })
  }
  const token = req.headers.authorization.split(' ')[1]
  try {
    let user
    if (payload.role === 0) {
      console.log('身分為一般使用者')
      user = await users.findById(payload._id)
    }
    if (payload.role === 1) {
      console.log('身分為管理者')
      user = await admins.findById(payload._id)
    }
    if (payload.role === 2) {
      console.log('身分為店員')
      user = await staffs.findById(payload._id).populate('stores')
    }
    // const user = await users.findById(payload._id)
    if (!user) {
      return done(null, false, { message: '使用者不存在' })
    }
    if (user.tokens.indexOf(token) === -1) {
      return done(null, false, { message: '驗證錯誤' })
    }
    return done(null, { user, token, role: payload.role })
  } catch (error) {
    return done(error, false)
  }
}))
