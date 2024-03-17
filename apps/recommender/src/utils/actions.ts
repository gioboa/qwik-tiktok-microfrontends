import { ENV_VARIABLES } from '../env';
import { Query, database } from './AppWriteClient';

export const getRandomUsers = async () => {
  const profileResult = await database.listDocuments(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_PROFILE),
    [Query.limit(5)],
  );
  const documents = profileResult.documents;

  const objPromises = documents.map((profile) => {
    return {
      userId: profile?.user_id,
      name: profile?.name,
      image: profile?.image,
    };
  });

  const result = await Promise.all(objPromises);
  return result;
};

export const createBucketUrl = (fileId: string) => {
  const url = ENV_VARIABLES.VITE_APPWRITE_URL;
  const id = ENV_VARIABLES.VITE_BUCKET_ID;
  const endpoint = ENV_VARIABLES.VITE_ENDPOINT;

  if (!url || !id || !endpoint || !fileId) return '';

  return `${url}/storage/buckets/${id}/files/${fileId}/view?project=${endpoint}`;
};
