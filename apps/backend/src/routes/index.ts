import { Router } from 'express';
import healthRoutes from './health.routes';
import authRoutes from './auth.routes';
import sosRoutes from './sos.routes';
import mapsRoutes from './maps.routes';
import volunteerRoutes from './volunteer.routes';
import policeRoutes from './police.routes';

const router = Router();

router.use('/', healthRoutes);
router.use('/auth', authRoutes);
router.use('/sos', sosRoutes);
router.use('/maps', mapsRoutes);
router.use('/volunteers', volunteerRoutes);
router.use('/police', policeRoutes);

// Phase 7: AI        → router.use('/ai', aiRoutes)
// Phase 8: community → router.use('/community', communityRoutes)

export default router;
