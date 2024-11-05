// media/router.ts
import { Router } from 'express';
import controller from './controller';
import rateLimiter from '../../middlewares/rateLimiter';

const router = Router();

router.route('/upload').post( controller.uploadFile); // Create media
router.route('/').get(controller.getAllMedia); // Get all media
router.route('/:id').get(rateLimiter, controller.getMediaById); // Get media by ID
router.route('/search/:query').get(rateLimiter, controller.searchMedia); // Update media
router.route('/:id').delete(rateLimiter, controller.deleteMedia); // Delete media

export default router;
