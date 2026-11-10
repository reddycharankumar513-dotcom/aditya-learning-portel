import { Router } from 'express';
import { getCourses, getCourseBySlug, getFeaturedCourses } from '../controllers/courseController.js';

const router = Router();

router.get('/', getCourses);
router.get('/featured', getFeaturedCourses);
router.get('/:slug', getCourseBySlug);

export default router;
