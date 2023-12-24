import http from 'http';
import config from './config/config.js';
import app from './app.js';
import { initDB } from './db/mongodb.js';

await initDB();

const server = http.createServer(app);
const PORT = config.port;

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT} 🚀`);
});