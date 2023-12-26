import UserService from "../service/UserService.js";

// TODO: move /users endpoints from index.js into this controller class
class UserController {
  constructor() {
    this.userService = new UserService();
  }

  async getUserData(id) {
    const user = await this.userService.getUserData(id);
    return user;
  }

  async getAllUsers() {
    const users = await this.userService.getAllUsers();
    return users;
  }

  async authenticateUser(login) {
    const user = await this.userService.authenticateUser(login);
    return user;
  }
}

export default UserController;
