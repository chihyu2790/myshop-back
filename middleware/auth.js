import passport from 'passport'
import jsonwebtoken from 'jsonwebtoken'

export const login = (req, res, next) => {
  passport.authenticate('login', { session: false }, (err, user, info) => {
    if (err || !user) {
      if (info.message === 'Missing credentials') info.message = '驗證錯誤'
      return res.status(401).send({ success: false, message: info.message })
    }
    req.user = user
    next()
  })(req, res, next)
}

export const jwt = (req, res, next) => {
  passport.authenticate('jwt', { session: false }, (err, data, info) => {
    if (err || !data) {
      if (info instanceof jsonwebtoken.JsonWebTokenError) {
        return res.status(401).send({ success: false, message: '驗證錯誤' })
      } else {
        return res.status(401).send({ success: false, message: info.message })
      }
    }
    req.user = data.user
    req.token = data.token
    req.role = data.role
    console.log('準備從jwt離開')
    next()
  })(req, res, next)
}
