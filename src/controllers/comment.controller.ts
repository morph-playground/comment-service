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
      console.log(`[CommentController] createComment called by userId: ${userId}`);
      if (!userId) {
        console.warn('[CommentController] User ID missing in createComment');
        res.status(401).json({ error: 'User ID required' });
        return;
      }

      const { projectId, taskId, text } = req.body;
      if (!projectId || !taskId || !text) {
        console.warn('[CommentController] Missing body parameters in createComment', req.body);
        res.status(400).json({ error: 'projectId, taskId, and text are required' });
        return;
      }

      console.log(`[CommentController] Creating comment for projectId: ${projectId}, taskId: ${taskId}`);
      const comment = await this.commentService.createComment(userId, { projectId, taskId, text });
      console.log('[CommentController] Comment created:', comment);
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
      console.log(`[CommentController] getComments called by userId: ${userId}`);
      if (!userId) {
        console.warn('[CommentController] User ID missing in getComments');
        res.status(401).json({ error: 'User ID required' });
        return;
      }

      const { projectId, taskId } = req.query;
      if (!projectId || !taskId) {
        console.warn('[CommentController] Missing query parameters in getComments', req.query);
        res.status(400).json({ error: 'projectId and taskId query parameters are required' });
        return;
      }

      console.log(`[CommentController] Fetching comments for projectId: ${projectId}, taskId: ${taskId}`);
      const comments = await this.commentService.getComments(userId, projectId as string, taskId as string);
      console.log('[CommentController] Comments fetched:', comments);
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