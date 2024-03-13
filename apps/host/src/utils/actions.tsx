import { $ } from '@builder.io/qwik';
import { ID, Query } from 'appwrite';
import Image from 'image-js';
import { CropperDimensions } from '../components/EditProfileOverlay';
import { RandomUsers } from '../components/Header';
import { database, storage } from './AppWriteClient';

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

export const createBucketUrl = (fileId: string) => {
  const url = import.meta.env.VITE_APPWRITE_URL;
  const id = import.meta.env.VITE_BUCKET_ID;
  const endpoint = import.meta.env.VITE_ENDPOINT;

  if (!url || !id || !endpoint || !fileId) return '';

  return `${url}/storage/buckets/${id}/files/${fileId}/view?project=${endpoint}`;
};

export const searchProfilesByName = async (
  name: string,
): Promise<RandomUsers[] | undefined> => {
  try {
    const profileResult = await database.listDocuments(
      String(import.meta.env.VITE_DATABASE_ID),
      String(import.meta.env.VITE_COLLECTION_ID_PROFILE),
      [Query.limit(5), Query.search('name', name)],
    );

    const objPromises = profileResult.documents.map((profile) => {
      return {
        id: profile?.user_id,
        name: profile?.name,
        image: profile?.image,
      };
    });

    const result = await Promise.all(objPromises);
    return result;
  } catch (error) {
    console.log(error);
  }
};

export const createPost = async (
  file: File,
  userId: string,
  caption: string,
) => {
  const videoId = Math.random().toString(36).slice(2, 22);

  await database.createDocument(
    String(import.meta.env.VITE_DATABASE_ID),
    String(import.meta.env.VITE_COLLECTION_ID_POST),
    ID.unique(),
    {
      user_id: userId,
      text: caption,
      video_url: videoId,
      created_at: new Date().toISOString(),
    },
  );
  await storage.createFile(
    String(import.meta.env.VITE_BUCKET_ID),
    videoId,
    file,
  );
};

export const getPostsByUser = async (userId: string) => {
  const response = await database.listDocuments(
    String(import.meta.env.VITE_DATABASE_ID),
    String(import.meta.env.VITE_COLLECTION_ID_POST),
    [Query.equal('user_id', userId), Query.orderDesc('$id')],
  );
  const documents = response.documents;
  const result = documents.map((doc) => {
    return {
      id: doc?.$id,
      user_id: doc?.user_id,
      video_url: doc?.video_url,
      text: doc?.text,
      created_at: doc?.created_at,
    };
  });

  return result;
};

export const changeUserImage = async (
  file: File,
  cropper: CropperDimensions,
  currentImage: string,
) => {
  const videoId = Math.random().toString(36).slice(2, 22);

  const x = cropper.left;
  const y = cropper.top;
  const width = cropper.width;
  const height = cropper.height;

  const response = await fetch(URL.createObjectURL(file));
  const imageBuffer = await response.arrayBuffer();

  const image = await Image.load(imageBuffer);
  const croppedImage = image.crop({ x, y, width, height });
  const resizedImage = croppedImage.resize({ width: 200, height: 200 });
  const blob = await resizedImage.toBlob();
  const arrayBuffer = await blob.arrayBuffer();
  const finalFile = new File([arrayBuffer], file.name, { type: blob.type });
  const result = await storage.createFile(
    String(import.meta.env.VITE_BUCKET_ID),
    videoId,
    finalFile,
  );

  return result?.$id;
};

export const updateProfileImage = async (id: string, image: string) => {
  await database.updateDocument(
    String(import.meta.env.VITE_DATABASE_ID),
    String(import.meta.env.VITE_COLLECTION_ID_PROFILE),
    id,
    {
      image: image,
    },
  );
};

export const updateProfile = async (id: string, name: string, bio: string) => {
  await database.updateDocument(
    String(import.meta.env.VITE_DATABASE_ID),
    String(import.meta.env.VITE_COLLECTION_ID_PROFILE),
    id,
    {
      name: name,
      bio: bio,
    },
  );
};
