const auth = require("../../middlewares/auth")
const providerController = require("../controllers/providerController")

const router = require("express").Router()

router.post("/addservice", auth, providerController.addService)
router.post("/editservice/:id", auth, providerController.editService)
router.delete("/removeservice/:id", auth, providerController.removeService)

module.exports = router
