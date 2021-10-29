import { Request, Response, Router } from 'express';
import { getTagsForText } from '../services/textService';

const router = Router();

router.post('/analyse', async (req: Request, res: Response) => {
  if (!req.body.text) {
    return res.status(500);
  }

  const tags = await getTagsForText(req.body.text, req.body.type.toLowerCase());

  return res.json(tags);
});

export default router;
