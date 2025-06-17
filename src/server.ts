import { createApp } from './app';

const PORT = process.env.PORT || 3000;

const PERMISSION_SERVICE_HOST = process.env.PERMISSION_SERVICE_HOST || 'localhost';
console.log('Permission service host:', PERMISSION_SERVICE_HOST);
const PERMISSION_SERVICE_PORT = parseInt(process.env.PERMISSION_SERVICE_PORT || '3001', 10);
console.log('Permission service port:', PERMISSION_SERVICE_PORT);

const app = createApp({
  host: PERMISSION_SERVICE_HOST,
  port: PERMISSION_SERVICE_PORT
});
app.listen(PORT, () => {
  console.log('Server configuration:', {
    port: PORT,
    permissionService: {
      host: PERMISSION_SERVICE_HOST,
      port: PERMISSION_SERVICE_PORT
    }
  });
  console.log(`Server is running on port ${PORT}`);
});