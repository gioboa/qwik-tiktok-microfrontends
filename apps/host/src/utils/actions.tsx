import { $ } from '@builder.io/qwik';
import { ID, Query } from 'appwrite';
import { database } from './AppWriteClient';

export const createProfile = $(
  async (userId: string, name: string, image: string, bio: string) => {
    await database.createDocument(
      String(import.meta.env.VITE_DATABASE_ID),
      String(import.meta.env.VITE_COLLECTION_ID_PROFILE),
      ID.unique(),
      {
        user_id: userId,
        name: name,
        image: image,
        bio: bio,
      },
    );
  },
);

export const getProfileByUserId = async (userId: string) => {
  const response = await database.listDocuments(
    String(import.meta.env.VITE_DATABASE_ID),
    String(import.meta.env.VITE_COLLECTION_ID_PROFILE),
    [Query.equal('user_id', userId)],
  );
  const documents = response.documents;
  return {
    id: documents[0]?.$id,
    user_id: documents[0]?.user_id,
    name: documents[0]?.name,
    image: documents[0]?.image,
    bio: documents[0]?.bio,
  };
};
