import { object, parse, string } from 'valibot';

const envVariables = object({
  VITE_APPWRITE_URL: string(),
  VITE_ENDPOINT: string(),
  VITE_DATABASE_ID: string(),
  VITE_COLLECTION_ID_PROFILE: string(),
  VITE_COLLECTION_ID_POST: string(),
  VITE_COLLECTION_ID_LIKE: string(),
  VITE_COLLECTION_ID_COMMENT: string(),
  VITE_BUCKET_NAME: string(),
  VITE_BUCKET_ID: string(),
  VITE_PLACEHOLDER_DEFAULT_IMAGE_ID: string(),
});

export const ENV_VARIABLES = parse(envVariables, import.meta.env, {
  message: 'Invalid env variables',
});
