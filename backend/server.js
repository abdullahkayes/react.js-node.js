import http from 'http';
import dotenv from 'dotenv';
import app from './src/app.js';
import { connectDB } from './src/config/db.js';
import { syncDatabase } from './src/config/syncDb.js';

dotenv.config();

connectDB();

if (process.env.DB_SYNC === 'true') {
  syncDatabase();
}

const server = http.createServer(app);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default server;
