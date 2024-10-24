const checkAuth = require("../../middlewares/checkAuth")
const upload = require("../../middlewares/multer")
const providerController = require("../controllers/providerController")

const router = require("express").Router()

router.post(
  "/addservice",
  upload.array("images", 3),
  checkAuth,
  providerController.addService
)
router.patch(
  "/editservice/:id",
  upload.array("images", 3),
  checkAuth,
  providerController.editService
)
router.delete("/removeservice/:id", checkAuth, providerController.removeService)

module.exports = router
