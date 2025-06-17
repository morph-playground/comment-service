import { createApp } from './app';

const PORT = process.env.PORT || 3000;

const PERMISSION_SERVICE_HOST = process.env.PERMISSION_SERVICE_HOST || 'localhost';
const PERMISSION_SERVICE_PORT = parseInt(process.env.PERMISSION_SERVICE_PORT || '3001', 10);

console.log(`Starting server with config: 
  PORT = ${PORT}
  PERMISSION_SERVICE_HOST = ${PERMISSION_SERVICE_HOST}
  PERMISSION_SERVICE_PORT = ${PERMISSION_SERVICE_PORT}
`);

const app = createApp({
  host: PERMISSION_SERVICE_HOST,
  port: PERMISSION_SERVICE_PORT
});
console.log('Express app created, starting to listen...');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});