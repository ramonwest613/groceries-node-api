import StorageDao from "../data/StorageDao.js";

class StorageAreaService {
  constructor() {
    this.storageDao = new StorageDao();
  }

  async getStorageArea(id) {
    const storageArea = await this.storageDao.getStorageArea(id);
    return storageArea;
  }
  
  async getStorageAreasByUserId(userId) {
    const storageAreas = await this.storageDao.getStorageAreasByUserId(userId);
    return storageAreas;
  }

  async createStorageArea(storageArea) {
    // Insert storage area first
    const newStorageId = await this.storageDao.insertStorageArea(storageArea);

    // use new ID to store userStorageArea record
    if (newStorageId > 0) {
      const userStorage = { userId: storageArea.userId, storageId: newStorageId };
      await this.storageDao.insertUserStorageArea(userStorage);
    }
    // return all of user's storage areas
    const storageAreas = await this.storageDao.getStorageAreasByUserId(storageArea.userId);
    return  storageAreas;
    
  }

  async editStorageArea(storageArea) {

  }

  async deleteStorageArea(id) {

  }
}

export default StorageAreaService;
