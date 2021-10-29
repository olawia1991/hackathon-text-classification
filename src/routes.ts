import { Router } from 'express';
import textController from './controllers/text-controller';
import photosController from './controllers/photos-controller';

const router = Router();

router.get('/healthcheck', (_, res) => res.send('API is up and running'));

router.use('/photos', photosController);
router.use('/text', textController);

export default router;
