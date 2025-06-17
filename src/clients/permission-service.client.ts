import axios from 'axios';

export enum Domain {
  PROJECT = 'PROJECT',
  PROJECT_USER = 'PROJECT_USER',
  TASK = 'TASK',
  SUBSCRIPTION = 'SUBSCRIPTION',
  USER = 'USER',
  COMMENT = 'COMMENT'
}

export enum Action {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE',
  LIST = 'LIST',
  ACCESS_ALL = 'ACCESS_ALL'
}

export interface PermissionServiceConfig {
  host: string;
  port: number;
}

export interface PermissionResponse {
  allowed: boolean;
}

export class PermissionServiceClient {
  private baseUrl: string;

  constructor(config: PermissionServiceConfig) {
    this.baseUrl = `http://${config.host}:${config.port}`;
    console.log(`Initialized PermissionServiceClient with base URL: ${this.baseUrl}`);
  }

  async hasPermission(subjectId: string, domain: Domain, action: Action): Promise<boolean> {
    console.log(`Checking permission for subject ${subjectId} on domain ${domain} for action ${action}`);
    try {
      const response = await axios.get<PermissionResponse>(
        `${this.baseUrl}/permissions/check`,
        {
          params: {
            subjectId,
            domain,
            action
          }
        }
      );
      const allowed = response.data.allowed;
      console.log(`Permission check result for ${subjectId}: ${allowed}`);
      return allowed;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        // Handle specific error cases if needed
        console.error(`Permission check failed: ${error.message}`);
      } else {
        console.error(`Unexpected error during permission check: ${error}`);
      }
      return false; // Default to denying permission on error
    }
  }
}