class User {
  constructor(id, name, password, storageAreas) {
    this.id = id;
    this.name = name;
    this.password = password;
    this.storageAreas = storageAreas;
  }

  getName() {
    return this.name;
  }
}

module.exports = User;
