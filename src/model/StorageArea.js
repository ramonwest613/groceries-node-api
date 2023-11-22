class StorageArea {
    constructor(storage_id, storage_name) {
      this.storage_id = storage_id;
      this.storage_name = storage_name;
      this.categories = [];
    }
  
    addCategory(category) {
      this.categories.push(category);
    }
  }
export default StorageArea;