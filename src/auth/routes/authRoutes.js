const router = require("express").Router()
const authController = require("../controllers/authController")

router.post("/register", authController.register)
router.post("/login", authController.login)
router.get("/check-auth", authController.checkAuth)
router.patch("/change-password", authController.changePassword)

module.exports = router
