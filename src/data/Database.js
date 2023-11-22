// import mysql2 library for interfacing with MySql database
import mysql from "mysql2";

// dotenv lets us set environment variables in an .env file
// using this for DB connection 
import dotenv from "dotenv";
dotenv.config();

// create connection pool
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  user: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: true },
}).promise();

// execute select statements with no params, return array of rows
export async function selectData(sql) {
  const result = await pool.query(sql);
  const rows = result[0];
  return rows;  
}

// execute prepared statement, return array of rows
export async function selectDataWithParms(sql, params) {
  const result = await pool.query(sql, params);
  const rows = result[0];
  
  return rows;  
}

// execute insert statement and return array of new created id values
export async function insertData(sql, params) {
  const result = await pool.query(sql, params);
  const rows = result[0];
  return rows.insertId;
}