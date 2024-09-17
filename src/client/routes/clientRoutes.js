const router = require("express").Router()
const checkAuth = require("../../middlewares/checkAuth")
const clientController = require("../controllers/clientController")

router.post("/edit/:id", checkAuth, clientController.edit)
router.post("/send-actual-location", checkAuth, clientController.sendActualLocation)

module.exports = router
