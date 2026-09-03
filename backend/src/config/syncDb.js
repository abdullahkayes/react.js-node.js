import { sequelize } from './db.js';
import { User, Address, RateCard, Shipment, TrackingEvent, Payment } from '../models/index.js';

const syncDatabase = async () => {
  try {
    await sequelize.sync({ force: false, alter: true });
    console.log('Database synced successfully');
  } catch (error) {
    console.error('Error syncing database:', error.message);
    process.exit(1);
  }
};

export { syncDatabase };

const isMainModule = process.argv[1] && process.argv[1].includes('syncDb.js');
if (isMainModule) {
  syncDatabase();
}
