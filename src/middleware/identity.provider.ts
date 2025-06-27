import { Request } from 'express';

export class IdentityProvider {
  getUserId(req: Request): string | null {
    const userId = req.header('identity-user-id');
    console.log(`[IdentityProvider] Extracted user ID from headers: ${userId}`);
    return userId || null;
  }

  getTenantId(req: Request): string | null {
    const tenantId = req.header('identity-tenant-id');
    console.log(`[IdentityProvider] Extracted tenant ID from headers: ${tenantId}`);
    return tenantId || null;
  }
}