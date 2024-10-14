const multer = require("multer")
const path = require("path")

// Definindo o storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "src/public/service/images")
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  },
})

const upload = multer({ storage: storage })

module.exports = upload
