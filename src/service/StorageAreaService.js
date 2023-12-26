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
    
  }

  async editStorageArea(storageArea) {

  }

  async deleteStorageArea(id) {

  }
}

export default StorageAreaService;
