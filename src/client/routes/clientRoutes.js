const router = require("express").Router()
const checkAuth = require("../../middlewares/checkAuth")
const clientController = require("../controllers/clientController")

router.post("/edit/:id", checkAuth, clientController.edit)

module.exports = router
