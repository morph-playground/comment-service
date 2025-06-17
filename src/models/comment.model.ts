export interface Comment {
  id: string;
  userId: string;
  projectId: string;
  taskId: string;
  text: string;
  createdAt: Date;
}

export interface CreateCommentRequest {
  projectId: string;
  taskId: string;
  text: string;
}

console.log('Loaded comment.model.ts');