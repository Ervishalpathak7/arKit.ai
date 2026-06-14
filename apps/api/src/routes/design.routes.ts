import { Router } from 'express';
import {
  CreateDesignController,
  GetDesignController,
} from '@/controllers/design.controllers.js';

const router: Router = Router();

router.post('/design/generate', CreateDesignController);
router.get('/design/:id/stream', GetDesignController);

export default router;
