export interface Comment {
  id: string;
  userId: string;
  projectId: string;
  taskId: string;
  text: string;
  createdAt: Date;
}

// Debug: Log when the interfaces are loaded
('[Debug] comment.model.ts: Interfaces loaded');

export interface CreateCommentRequest {
  projectId: string;
  taskId: string;
  text: string;
}