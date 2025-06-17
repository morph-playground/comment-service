import { v4 as uuidv4 } from 'uuid';
import { Comment, CreateCommentRequest } from '../models/comment.model';
import { PermissionServiceClient, Domain, Action } from '../clients/permission-service.client';

export class CommentService {
  private comments: Comment[] = [];

  constructor(private permissionServiceClient: PermissionServiceClient) {}

  async createComment(userId: string, request: CreateCommentRequest): Promise<Comment> {
    const hasPermission = await this.permissionServiceClient.hasPermission(userId, Domain.COMMENT, Action.CREATE);
    if (!hasPermission) {
      throw new Error('Access denied');
    }

    const comment: Comment = {
      id: uuidv4(),
      userId,
      projectId: request.projectId,
      taskId: request.taskId,
      text: request.text,
      createdAt: new Date()
    };

    this.comments.push(comment);
    return comment;
  }

  async getComments(userId: string, projectId: string, taskId: string): Promise<Comment[]> {
    const hasPermission = await this.permissionServiceClient.hasPermission(userId, Domain.COMMENT, Action.LIST);
    if (!hasPermission) {
      throw new Error('Access denied');
    }

    return this.comments.filter(comment => 
      comment.projectId === projectId && comment.taskId === taskId
    );
  }
}