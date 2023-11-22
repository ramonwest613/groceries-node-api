class Category {
    constructor(category_id, category_name) {
      this.category_id = category_id;
      this.category_name = category_name;
      this.items = [];
    }
  
    addItem(item) {
      this.items.push(item);
    }
  }

export default Category;