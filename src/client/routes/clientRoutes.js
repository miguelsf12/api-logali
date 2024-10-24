const router = require("express").Router()
const checkAuth = require("../../middlewares/checkAuth")
const clientController = require("../controllers/clientController")

router.post("/edit/:id", checkAuth, clientController.edit)
router.post("/send-actual-location", clientController.sendActualLocation)
router.get("/get-user-profile", checkAuth, clientController.getUserProfile)

module.exports = router
