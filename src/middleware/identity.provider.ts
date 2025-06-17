import { Request } from 'express';

export class IdentityProvider {
  getUserId(req: Request): string | null {
    const userId = req.header('identity-user-id');
    console.log(`[IdentityProvider] User ID from headers: ${userId}`);
    return userId || null;
  }
}