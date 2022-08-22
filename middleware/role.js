export default (typeArr) => {
  return (req, res, next) => {
    if (typeArr !== req.role) {
      return res.status(400).send({ success: false, message: '權限錯誤' })
    }
    next()
  }
}
