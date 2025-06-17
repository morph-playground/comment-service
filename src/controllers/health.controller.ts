import { Request, Response } from 'express';

export class HealthController {
  getHealth(req: Request, res: Response): void {
    console.log('Received health check request');
    res.status(200).json({ status: "OK" });
    console.log('Health check response sent');
  }
}