export interface Comment {
  id: string;
  userId: string;
  projectId: string;
  taskId: string;
  text: string;
  createdAt: Date;
}

console.log('Comment model loaded');

export interface CreateCommentRequest {
  projectId: string;
  taskId: string;
  text: string;
}

console.log('CreateCommentRequest model loaded');