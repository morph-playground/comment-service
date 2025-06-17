import express from 'express';
import { HealthController } from './controllers/health.controller';
import { CommentController } from './controllers/comment.controller';
import { IdentityProvider } from './middleware/identity.provider';
import { PermissionServiceClient } from './clients/permission-service.client';
import { CommentService } from './services/comment.service';

export function createApp(permissionServiceConfig: { host: string; port: number }) {
  const app = express();
  app.use(express.json());

  console.log('Starting application with permissionServiceConfig:', permissionServiceConfig);

  const identityProvider = new IdentityProvider();
  const permissionServiceClient = new PermissionServiceClient(permissionServiceConfig);
  const commentService = new CommentService(permissionServiceClient);

  const healthController = new HealthController();
  const commentController = new CommentController(commentService, identityProvider);

  app.get('/health', (req, res) => {
    console.log('Received GET /health request');
    healthController.getHealth(req, res);
  });
  app.post('/comments', (req, res) => {
    console.log('Received POST /comments request. Body:', req.body);
    commentController.createComment(req, res);
  });
  app.get('/comments', (req, res) => {
    console.log('Received GET /comments request. Query:', req.query);
    commentController.getComments(req, res);
  });

  return app;
}