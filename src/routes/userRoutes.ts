import { Router } from 'express';
import { getUserControle } from '../controllers/getUser';

const router = Router();

router.post('/', getUserControle)

export default router;