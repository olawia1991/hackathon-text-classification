import { dynamoDb } from './aws';

const tableName: string = 'dev-HackathonTextClassification';

export interface PhotoRating {
    id: string;
    source: string;
    url: string;
    isLiked: boolean;
}

export const getUserPhotoRatings = async (user: string, tags: string[]) => {
    let imageRatings: PhotoRating[] = [];

    var params = {
        TableName: tableName,
        Key: {
            user: {S: user},
            tags: {S: JSON.stringify(tags)},
        }
    }
    const getItemOutput = await dynamoDb.getItem(params).promise();

    if (getItemOutput && getItemOutput.Item && getItemOutput.Item.imageRatings && getItemOutput.Item.imageRatings.S){
        imageRatings = JSON.parse(getItemOutput.Item.imageRatings.S);
    }

    return imageRatings;
}

const putUserPhotoRatings = async (user: string, tags: string[], imageRatings: PhotoRating[]) => {
    var params = {
        TableName: tableName,
        Item: {
            user: {S: user},
            tags: {S: JSON.stringify(tags)},
            imageRatings: {S: JSON.stringify(imageRatings)}
        }
    }
    const putItemOutput = await dynamoDb.putItem(params).promise();
    return putItemOutput;
}

export const saveUserPhotoRatings = async (user: string, tags: string[], photo: any, isLiked: boolean) => {
    const imageRatings = await getUserPhotoRatings(user, tags);
    imageRatings.push({id: photo.id, source: photo.source, url: photo.url, isLiked: isLiked});
    return await putUserPhotoRatings(user, tags, imageRatings);
}