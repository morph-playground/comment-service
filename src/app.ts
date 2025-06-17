import express from 'express';
import { HealthController } from './controllers/health.controller';
import { CommentController } from './controllers/comment.controller';
import { IdentityProvider } from './middleware/identity.provider';
import { PermissionServiceClient } from './clients/permission-service.client';
import { CommentService } from './services/comment.service';

export function createApp(permissionServiceConfig: { host: string; port: number }) {
  const app = express();
  app.use(express.json());

  console.log('Creating IdentityProvider');
  const identityProvider = new IdentityProvider();

  console.log('Creating PermissionServiceClient');
  const permissionServiceClient = new PermissionServiceClient(permissionServiceConfig);

  console.log('Creating CommentService');
  const commentService = new CommentService(permissionServiceClient);

  console.log('Creating HealthController');
  const healthController = new HealthController();

  console.log('Creating CommentController');
  const commentController = new CommentController(commentService, identityProvider);

  console.log('Registering routes');
  app.get('/health', (req, res) => healthController.getHealth(req, res));
  app.post('/comments', (req, res) => commentController.createComment(req, res));
  app.get('/comments', (req, res) => commentController.getComments(req, res));

  console.log('App created');
  return app;
}