import { Request, Response, Router } from "express";
import { getPhotosFromUnsplash, getPhotosPexels, ratePhoto } from "../services/photoService";

const router = Router();


router.post("/ratePhoto", async (req: Request, res: Response) => {
  const { user, photo, tags, isLiked } = req.body;
  await ratePhoto(user, photo, tags, isLiked);
  return res.status(200).json(photo);
});


router.post('/getPhotosForTags', async (req: Request, res: Response) => {
  const { user, tags, imageServices } = req.body;
  if (!tags || !Array.isArray(tags) || !tags.length || !imageServices.length) {
    return res.status(500);
  }
  try {

    // build promises
    const getPhotos: Promise<any>[] = [];

    if (imageServices.includes('Unsplash')) {
      getPhotos.push(getPhotosFromUnsplash(tags, user));
    }
    if (imageServices.includes('Pexels')) {
      getPhotos.push(getPhotosPexels(tags, user));
    }

    const allPhotos = await Promise.all(getPhotos);
    const photos = allPhotos.reduce(function (arr, p) {
      return arr.concat(p);
    }, []);

    return res.json(photos);
  } catch (e) {
    console.error(e);
    return res.status(500);
  }
});

export default router;