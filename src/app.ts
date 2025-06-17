import express from 'express';
import { HealthController } from './controllers/health.controller';
import { CommentController } from './controllers/comment.controller';
import { IdentityProvider } from './middleware/identity.provider';
import { PermissionServiceClient } from './clients/permission-service.client';
import { CommentService } from './services/comment.service';

export function createApp(permissionServiceConfig: { host: string; port: number }) {
  console.log('Creating Express app with permission service config:', permissionServiceConfig);
  const app = express();
  app.use(express.json());
  console.log('Express middleware setup complete');

  const identityProvider = new IdentityProvider();
  const permissionServiceClient = new PermissionServiceClient(permissionServiceConfig);
  const commentService = new CommentService(permissionServiceClient);

  const healthController = new HealthController();
  const commentController = new CommentController(commentService, identityProvider);

  app.get('/health', (req, res) => {
    console.log('GET /health request received');
    healthController.getHealth(req, res);
  });
  app.post('/comments', (req, res) => {
    console.log('POST /comments request received with body:', req.body);
    commentController.createComment(req, res);
  });
  app.get('/comments', (req, res) => {
    console.log('GET /comments request received');
    commentController.getComments(req, res);
  });

  return app;
}