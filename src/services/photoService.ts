import { createApi } from "unsplash-js";
import nodeFetch from "node-fetch";
import { saveUserPhotoRatings, PhotoRating, getUserPhotoRatings} from './dynamoDbService'


interface Photo {
  id: string;
  source: string;
  url: string;
}


const unsplashApp = createApi({
  accessKey: process.env.UNSPLASH_ACCESS_KEY_ID || "",
  fetch: nodeFetch as any,
});

export const getPhotosFromUnsplash = async (tags: string[], user: string, perPage = 10) => {

  const result = await unsplashApp.search.getPhotos({
    query: `"${tags.join(" ")}"`,
    perPage,
  });

  if (!Array.isArray(result.response.results)) {
    throw new Error("Invalid image result");
  }

  const photoResults: Photo[] =  result.response.results.map(({ id, urls }: any) => {
    return {
      id,
      source: "UNSPLASH",
      url: urls.small,
    };
  });

  const userPhotoRatings: PhotoRating[] = await getUserPhotoRatings(user, tags);
  return filterPhotosForUser(userPhotoRatings, photoResults);

};

export const getPhotosPexels = async (tags: string[], user: string, perPage = 10) => {
    const response = await nodeFetch(
        `https://api.pexels.com/v1/search?query=${tags.join(
            " "
        )}&per_page=${perPage}`,
        {
          method: "GET",
          withCredentials: true,
          // @ts-ignore
          headers: {
            Authorization: process.env.PEXELS_API_KEY,
            "Content-Type": "application/json",
          },
        }
    );
    const data = await response.json();

    const photoResults: Photo[] = data.photos.map(({ id, src }: any) => {
      return {
        id,
        source: "PEXELS",
        url: src.medium,
      };
    });

    const userPhotoRatings: PhotoRating[] = await getUserPhotoRatings(user, tags);
    return filterPhotosForUser(userPhotoRatings, photoResults);
};


function filterPhotosForUser(userPhotoRatings:PhotoRating[], photos: Photo[] ) {
  const photoIdsToFilter = userPhotoRatings
      ? userPhotoRatings.filter((p) => p.isLiked === false).map((p) =>  p.id)
      : [];

  return photos.filter((photo) => !photoIdsToFilter.includes(photo.id));
}


interface Photo {
  id: string;
  source: string;
  url: string;
}

export const ratePhoto =  async (user: string, photo: Photo, tags: string[], isLiked: boolean) => {
  return saveUserPhotoRatings(user,tags, photo, isLiked );
}


