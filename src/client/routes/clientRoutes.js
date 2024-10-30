const router = require("express").Router()
const checkAuth = require("../../middlewares/checkAuth")
const clientController = require("../controllers/clientController")
const upload = require("../../middlewares/multer")

router.patch("/edit/:id", upload.single('image'), checkAuth, clientController.editUser)
router.post("/send-actual-location", clientController.sendActualLocation)
router.get("/get-user-profile", checkAuth, clientController.getUserProfile)

module.exports = router
