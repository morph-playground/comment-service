import { Request, Response } from 'express';
import { CommentService } from '../services/comment.service';
import { IdentityProvider } from '../middleware/identity.provider';

export class CommentController {
  constructor(
    private commentService: CommentService,
    private identityProvider: IdentityProvider
  ) {}

  async createComment(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.identityProvider.getUserId(req);
      
      if (!userId) {
        
        res.status(401).json({ error: 'User ID required' });
        return;
      }

      const { projectId, taskId, text } = req.body;
      if (!projectId || !taskId || !text) {
        
        res.status(400).json({ error: 'projectId, taskId, and text are required' });
        return;
      }

      
      const comment = await this.commentService.createComment(userId, { projectId, taskId, text });
      
      res.status(201).json(comment);
    } catch (error) {
      console.error('[CommentController] Error in createComment:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        res.status(403).json({ error: 'Access denied' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }

  async getComments(req: Request, res: Response): Promise<void> {
    try {
      const userId = this.identityProvider.getUserId(req);
      
      if (!userId) {
        
        res.status(401).json({ error: 'User ID required' });
        return;
      }

      const { projectId, taskId } = req.query;
      if (!projectId || !taskId) {
        
        res.status(400).json({ error: 'projectId and taskId query parameters are required' });
        return;
      }

      
      const comments = await this.commentService.getComments(userId, projectId as string, taskId as string);
      
      res.status(200).json(comments);
    } catch (error) {
      console.error('[CommentController] Error in getComments:', error);
      if (error instanceof Error && error.message === 'Access denied') {
        res.status(403).json({ error: 'Access denied' });
      } else {
        res.status(500).json({ error: 'Internal server error' });
      }
    }
  }
}