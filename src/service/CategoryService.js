import CategoryDao from "../data/CategoryDao.js";

class CategoryService {
    constructor() {
        this.categoryDao = new CategoryDao();
    }

    async createCategory(category) {
        // Insert storage area first
        const newCategoryId = await this.categoryDao.insertCategory(category);
    
        // use new ID to store storageAreaCategory record
        if (newCategoryId > 0) {
          const storageCategory = { storageId: category.storageId, categoryId: newCategoryId };
          await this.categoryDao.insertStorageAreaCategory(storageCategory);
        }
        // return all of user's storage area-categories
        const categories = await this.categoryDao.getCategoriesByStorageId(category.storageId);
        return  categories;
        
      }
}

export default CategoryService;