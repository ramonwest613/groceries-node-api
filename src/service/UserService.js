import UserDao from "../data/UserDao.js";

class UserService {
  constructor() {
    this.userDao = new UserDao();
  }

  async getUserData(id) {
    const user = await this.userDao.getUserData(id);
    return user;
  }

  async getAllUsers() {
    const users = await this.userDao.getAllUsers();
    return users;
  }

  async authenticateUser(login) {
    const user = await this.userDao.authenticateUser(login);
    return user;
  }
}

export default UserService;
