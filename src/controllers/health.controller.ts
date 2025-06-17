import { Request, Response } from 'express';

export class HealthController {
  getHealth(req: Request, res: Response): void {
    console.log('Health check endpoint called');
    res.status(200).json({ status: "OK" });
    console.log('Health check completed successfully');
  }
}