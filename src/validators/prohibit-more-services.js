const Forbiden = require("../errors/forbiden")
const Service = require("../providers/models/Service")

const prohibitMoreServices = async (user) => {
  const serviceExists = await Service.findOne({ "provider._id": user._id })

  if (serviceExists) {
    throw new Forbiden()
  }
}

module.exports = prohibitMoreServices
