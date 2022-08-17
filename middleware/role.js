export default (typeArr) => {
  return (req, res, next) => {
    console.log(req.role)
    if (!typeArr.includes(req.role)) {
      return res.status(400).send({ success: false, message: '權限錯誤' })
    } else {
      console.log('身分為:' + req.role)
    }

    next()
  }
}
