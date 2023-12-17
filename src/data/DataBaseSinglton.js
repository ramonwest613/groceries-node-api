import Database from './Database.js';

// Singleton pattern
let instance = null;

const getDatabaseInstance = () => {
  if (!instance) {
    instance = new Database();
  }

  return instance;
};

export default getDatabaseInstance;
