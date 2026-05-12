import { Router } from 'express';
import healthRoutes from './health.routes';

const router = Router();

/**
 * Mount all API routes here.
 * All routes are prefixed with /api (set in app.ts).
 *
 * Phase 2+ routes will be registered below as features are built.
 */
router.use('/', healthRoutes);

// Phase 2: auth routes  → router.use('/auth', authRoutes)
// Phase 3: SOS routes   → router.use('/sos', sosRoutes)
// Phase 4: location     → router.use('/location', locationRoutes)
// Phase 5: maps         → router.use('/maps', mapRoutes)
// Phase 6: volunteers   → router.use('/volunteers', volunteerRoutes)
// Phase 7: AI           → router.use('/ai', aiRoutes)
// Phase 8: community    → router.use('/community', communityRoutes)

export default router;
