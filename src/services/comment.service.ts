import { v4 as uuidv4 } from 'uuid';
import { Comment, CreateCommentRequest } from '../models/comment.model';
import { PermissionServiceClient, Domain, Action } from '../clients/permission-service.client';

export class CommentService {
  private comments: Comment[] = [];

  constructor(private permissionServiceClient: PermissionServiceClient) {}

  async createComment(userId: string, request: CreateCommentRequest, tenantId: string): Promise<Comment> {
    console.log(`createComment called with userId=${userId}, projectId=${request.projectId}, taskId=${request.taskId}, tenantId=${tenantId}`);
    const hasPermission = await this.permissionServiceClient.hasPermission(userId, tenantId, Domain.COMMENT, Action.CREATE);
    console.log(`Permission check for CREATE comment: userId=${userId}, result=${hasPermission}`);
    if (!hasPermission) {
      console.error(`Access denied for userId=${userId} on create comment`);
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
    console.log(`Comment created: ${JSON.stringify(comment)}`);
    return comment;
  }

  async getComments(userId: string, projectId: string, taskId: string, tenantId: string): Promise<Comment[]> {
    console.log(`getComments called with userId=${userId}, projectId=${projectId}, taskId=${taskId}, tenantId=${tenantId}`);
    const hasPermission = await this.permissionServiceClient.hasPermission(userId, tenantId, Domain.COMMENT, Action.LIST);
    console.log(`Permission check for LIST comment: userId=${userId}, result=${hasPermission}`);
    if (!hasPermission) {
      console.error(`Access denied for userId=${userId} on list comments`);
      throw new Error('Access denied');
    }

    const filteredComments = this.comments.filter(comment => 
      comment.projectId === projectId && comment.taskId === taskId
    );
    console.log(`Found ${filteredComments.length} comments for projectId=${projectId}, taskId=${taskId}`);
    return filteredComments;
  }
}