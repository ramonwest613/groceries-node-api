import ItemDao from "../data/ItemDao.js";

class ItemService {
    constructor() {
        this.itemDao = new ItemDao();
    }

    async createItem(item) {
        // Insert storage area first
        const newItemId = await this.itemDao.insertItem(item);
    
        // use new ID to store storageAreaCategory record
        if (newItemId > 0) {
          const categoryItem = { categoryId: item.categoryId, itemId: newItemId };
          await this.itemDao.insertCategoryItem(categoryItem);
        }
        // return all of user's storage area-categories
        const items = await this.itemDao.getItemsByCategoryId(item.categoryId);
        return  items;
        
      }
}

export default ItemService;