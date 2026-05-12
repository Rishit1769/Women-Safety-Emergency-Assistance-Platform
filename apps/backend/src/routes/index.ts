import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import sosRoutes from './sos.routes';
import mapsRoutes from './maps.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/sos', sosRoutes);
router.use('/maps', mapsRoutes);

// Phase 6: volunteers → router.use('/volunteers', volunteerRoutes)
// Phase 7: AI        → router.use('/ai', aiRoutes)
// Phase 8: community → router.use('/community', communityRoutes)

export default router;
