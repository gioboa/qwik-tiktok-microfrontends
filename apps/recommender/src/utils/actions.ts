import { ENV_VARIABLES } from '../env';
import { ID, Query, database, storage } from './AppWriteClient';

export const createPost = async (
  file: File,
  userId: string,
  caption: string,
) => {
  const videoId = Math.random().toString(36).slice(2, 22);

  await database.createDocument(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_POST),
    ID.unique(),
    {
      user_id: userId,
      text: caption,
      video_url: videoId,
      created_at: new Date().toISOString(),
    },
  );
  await storage.createFile(String(ENV_VARIABLES.VITE_BUCKET_ID), videoId, file);
};

export const getProfileByUserId = async (userId: string) => {
  const response = await database.listDocuments(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_PROFILE),
    [Query.equal('user_id', userId)],
  );
  const documents = response.documents;
  return {
    id: documents[0]?.$id,
    userId: documents[0]?.user_id,
    name: documents[0]?.name,
    image: documents[0]?.image,
    bio: documents[0]?.bio,
  };
};

export const createBucketUrl = (fileId: string) => {
  const url = ENV_VARIABLES.VITE_APPWRITE_URL;
  const id = ENV_VARIABLES.VITE_BUCKET_ID;
  const endpoint = ENV_VARIABLES.VITE_ENDPOINT;

  if (!url || !id || !endpoint || !fileId) return '';

  return `${url}/storage/buckets/${id}/files/${fileId}/view?project=${endpoint}`;
};
