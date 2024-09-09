const checkAuth = require("../../middlewares/checkAuth")
const providerController = require("../controllers/providerController")

const router = require("express").Router()

router.post("/addservice", checkAuth, providerController.addService)
router.post("/editservice/:id", checkAuth, providerController.editService)
router.delete("/removeservice/:id", checkAuth, providerController.removeService)

module.exports = router
