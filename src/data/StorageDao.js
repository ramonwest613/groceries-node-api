import getDatabaseInstance from "./DataBaseSinglton.js";

const databaseInstance = getDatabaseInstance();

class StorageDao {
  // set sql query and call Database.js query function
  async getStorageArea(id) {
    // define query string
    // note - MySql lets us return a JSON object using JSON_OBJECT function, meaning we don't need a helper function to format the result set
    const sqlQuery = `
      SELECT 
        JSON_OBJECT(
            'id', sa.storage_id,
            'name', sa.storage_name
        ) as storageArea
        FROM storage_areas sa
        where sa.storage_id = ?;`;

    // call the Database.js function to query sql with paramater array
    let storageArea = await databaseInstance.query(sqlQuery, [id]);
    return storageArea;
  }

  async getStorageAreasByUserId(userId) {
    const sqlQuery = `
      SELECT 
        JSON_OBJECT(
            'storageAreas', ( SELECT
                JSON_ARRAYAGG(
                    JSON_OBJECT(
                        'id', sa.storage_id,
                        'name', sa.storage_name
                    )
                ) 
            FROM user_storage_areas usa
            LEFT JOIN storage_areas sa ON usa.storage_id = sa.storage_id
            WHERE usa.user_id = u.user_id
            )
        ) as userStorageAreas
        FROM users u
        where u.user_id = ?;`;

    let storageAreas = await databaseInstance.query(sqlQuery, [userId]);
    return storageAreas;
  }

  async insertStorageArea(storageArea) { 
    const sql = `INSERT INTO storage_areas (storage_name) VALUES (?)`;

    const result =  await databaseInstance.query(sql, [storageArea.name], (err, result) => {
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
  
  async insertUserStorageArea(userStorageArea) { 
    const userId = userStorageArea.userId;
    const storageId = userStorageArea.storageId;
    const sql = `INSERT INTO user_storage_areas (user_id, storage_id) VALUES (?,?)`;

    const result =  await databaseInstance.query(sql, [userId, storageId], (err, result) => {
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
}

export default StorageDao;
