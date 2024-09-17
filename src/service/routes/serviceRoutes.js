const serviceController = require("../controllers/serviceController")
const checkAuth = require("../../middlewares/checkAuth")

const router = require("express").Router()

router.get("/get-all-services", checkAuth, serviceController.getAllServices)
router.get("/get-services-filtered", checkAuth, serviceController.getServicesFiltered)
router.get("/get-routes-to-service/:id", checkAuth, serviceController.getRoutesToServices)

module.exports = router
