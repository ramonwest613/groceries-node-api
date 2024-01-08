import getDatabaseInstance from "./DataBaseSinglton.js";

const databaseInstance = getDatabaseInstance();

class ItemDao { 
    
    async insertItem(item) { 
        const sql = `INSERT INTO grocery_items (name, purchase_date, item_duration) VALUES (?, ?, ?)`;
    
        const result =  await databaseInstance.query(sql, [item.name, item.purchaseDate, item.itemDuration], (err, result) => {
          if (err) {
            console.error('Error inserting record:', err);
          } else {
            const newId = result.insertId;
            console.log('Record inserted successfully with ID:', newId);
          }
        }
        );
        return result.insertId;
      }  
      
      async insertCategoryItem(categoryItem) { 
        const categoryId = categoryItem.categoryId;
        const itemId = categoryItem.itemId;
        const sql = `INSERT INTO category_grocery_items (category_id, grocery_item_id) VALUES (?,?)`;
    
        const result =  await databaseInstance.query(sql, [categoryId, itemId], (err, result) => {
          if (err) {
            console.error('Error inserting record:', err);
          } else {
            const newId = result.insertId;
            console.log('Record inserted successfully with ID:', newId);
          }
        }
        );
    }

    async getItemsByCategoryId(categoryId) {
        const sqlQuery = `
          SELECT 
            JSON_OBJECT(
                'items', ( SELECT
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', gi.grocery_item_id,
                            'name', gi.name
                        )
                    ) 
                FROM category_grocery_items cgi
                LEFT JOIN grocery_items gi ON cgi.grocery_item_id = gi.grocery_item_id
                WHERE cgi.category_id = c.category_id
                )
            ) as categoryItems
            FROM categories c
            where c.category_id = ?;`;
    
        let items = await databaseInstance.query(sqlQuery, [categoryId]);
        return items;
      }
}

export default ItemDao;