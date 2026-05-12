import { Router } from 'express';

const router = Router();

/** Health check — used by Docker, load balancer, CI */
router.get('/health', (_req, res) => {
  res.status(200).json({
    status: 'ok',
    service: 'rakshaai-backend',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

export default router;
