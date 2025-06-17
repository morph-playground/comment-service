import { Request } from 'express';

export class IdentityProvider {
  getUserId(req: Request): string | null {
    console.log('Getting user ID from request');
    const userId = req.header('identity-user-id');
    console.log(`User ID found: ${userId}`);
    return userId || null;
  }
}