import { v4 as uuidv4 } from 'uuid';
import { Comment, CreateCommentRequest } from '../models/comment.model';
import { PermissionServiceClient, Domain, Action } from '../clients/permission-service.client';

export class CommentService {
  private comments: Comment[] = [];

  constructor(private permissionServiceClient: PermissionServiceClient) {}

  async createComment(userId: string, request: CreateCommentRequest): Promise<Comment> {
    const hasPermission = await this.permissionServiceClient.hasPermission(userId, Domain.COMMENT, Action.CREATE);
    if (!hasPermission) {
      console.log(`User ${userId} denied CREATE permission for comments`);
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
    console.log(`Created comment ${comment.id} for task ${taskId} in project ${projectId}`);
    return comment;
  }

  async getComments(userId: string, projectId: string, taskId: string): Promise<Comment[]> {
    const hasPermission = await this.permissionServiceClient.hasPermission(userId, Domain.COMMENT, Action.LIST);
    if (!hasPermission) {
      console.log(`User ${userId} denied CREATE permission for comments`);
      throw new Error('Access denied');
    }

    console.log(`Fetching comments for task ${taskId} in project ${projectId}`);
    return this.comments.filter(comment => 
      comment.projectId === projectId && comment.taskId === taskId
    );
  }
}