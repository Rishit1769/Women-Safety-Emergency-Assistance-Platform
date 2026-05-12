import { Router } from 'express';
import { authenticate } from '../middleware/auth.middleware';
import { aiRateLimiter } from '../middleware/rateLimiter.middleware';
import { validateBody } from '../middleware/zodValidate.middleware';
import { classifyEmergencySchema, riskAnalysisSchema, chatSchema } from '../validators/ai.validator';
import * as AiController from '../controllers/ai.controller';

const router = Router();

router.use(authenticate);
router.use(aiRateLimiter);

router.post('/classify', validateBody(classifyEmergencySchema), AiController.classify);
router.post('/risk-analysis', validateBody(riskAnalysisSchema), AiController.riskAnalysis);
router.post('/chat', validateBody(chatSchema), AiController.chat);

export default router;
