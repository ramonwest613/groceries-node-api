import getDatabaseInstance from "./DataBaseSinglton.js";

const databaseInstance = getDatabaseInstance();

class CategoryDao {

    async insertCategory(category) { 
        const sql = `INSERT INTO categories (category_name) VALUES (?)`;
    
        const result =  await databaseInstance.query(sql, [category.name], (err, result) => {
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
      
      async insertStorageAreaCategory(storageAreaCategory) { 
        const storageId = storageAreaCategory.storageId;
        const categoryId = storageAreaCategory.categoryId;
        const sql = `INSERT INTO storage_area_categories (storage_id, category_id) VALUES (?,?)`;
    
        const result =  await databaseInstance.query(sql, [storageId, categoryId], (err, result) => {
          if (err) {
            console.error('Error inserting record:', err);
          } else {
            const newId = result.insertId;
            console.log('Record inserted successfully with ID:', newId);
          }
        }
        );
    }

    async getCategoriesByStorageId(storageId) {
        const sqlQuery = `
          SELECT 
            JSON_OBJECT(
                'categories', ( SELECT
                    JSON_ARRAYAGG(
                        JSON_OBJECT(
                            'id', c.category_id,
                            'name', c.category_name
                        )
                    ) 
                FROM storage_area_categories sac
                LEFT JOIN categories c ON sac.category_id = c.category_id
                WHERE sac.storage_id = sa.storage_id
                )
            ) as storageAreaCategories
            FROM storage_areas sa
            where sa.storage_id = ?;`;
    
        let categories = await databaseInstance.query(sqlQuery, [storageId]);
        return categories;
      }
}

export default CategoryDao;