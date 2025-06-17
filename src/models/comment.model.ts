export interface Comment {
  id: string;
  userId: string;
  projectId: string;
  taskId: string;
  text: string;
  createdAt: Date;
}

console.debug('Comment model interface loaded');

export interface CreateCommentRequest {
  projectId: string;
  taskId: string;
  text: string;
}

console.debug('CreateCommentRequest interface loaded');