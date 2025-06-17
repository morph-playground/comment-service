import express from 'express';
import { HealthController } from './controllers/health.controller';
import { CommentController } from './controllers/comment.controller';
import { IdentityProvider } from './middleware/identity.provider';
import { PermissionServiceClient } from './clients/permission-service.client';
import { CommentService } from './services/comment.service';

export function createApp(permissionServiceConfig: { host: string; port: number }) {
  const app = express();
  console.log('Creating Express app');
  app.use(express.json());

  const identityProvider = new IdentityProvider();
  console.log('Created IdentityProvider');
  const permissionServiceClient = new PermissionServiceClient(permissionServiceConfig);
  console.log('Created PermissionServiceClient');
  const commentService = new CommentService(permissionServiceClient);
  console.log('Created CommentService');

  const healthController = new HealthController();
  console.log('Created HealthController');
  const commentController = new CommentController(commentService, identityProvider);
  console.log('Created CommentController');

  app.get('/health', (req, res) => {
    console.log('Handling /health request');
    healthController.getHealth(req, res);
  });
  app.post('/comments', (req, res) => {
    console.log('Handling /comments POST request');
    commentController.createComment(req, res);
  });
  app.get('/comments', (req, res) => {
    console.log('Handling /comments GET request');
    commentController.getComments(req, res);
  });

  return app;
}