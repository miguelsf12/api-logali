class Forbiden extends Error {
  constructor() {
    super("Ação não permitida.")
    this.name = "Forbiden"
  }
}

module.exports = Forbiden
