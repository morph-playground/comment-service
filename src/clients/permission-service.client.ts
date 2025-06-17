import axios from 'axios';
import { Logger } from 'winston';
import { createLogger, format, transports } from 'winston';

const logger: Logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp(),
    format.printf(({ level, message, timestamp }) => {
      return `[${timestamp}] [${level}]: ${message}`;
    })
  ),
  transports: [
    new transports.Console()
  ]
});

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
  }

  async hasPermission(subjectId: string, domain: Domain, action: Action): Promise<boolean> {
    try {
      logger.info(`Checking permission for subjectId: ${subjectId}, domain: ${domain}, action: ${action}`);
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
      logger.info(`Permission check result: ${response.data.allowed}`);
      return response.data.allowed;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        logger.error(`Permission check failed: ${error.message}`);
      } else {
        logger.error(`Unexpected error during permission check: ${error}`);
      }
      return false; // Default to denying permission on error
    }
  }
}