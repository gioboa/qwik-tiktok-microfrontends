import { $ } from '@builder.io/qwik';
import { ID, Query } from 'appwrite';
import Image from 'image-js';
import { CropperDimensions } from '../components/EditProfileOverlay';
import { RandomUsers } from '../components/Header';
import { database, storage } from './AppWriteClient';
import { ENV_VARIABLES } from '../env';

export const createProfile = $(
  async (userId: string, name: string, image: string, bio: string) => {
    await database.createDocument(
      String(ENV_VARIABLES.VITE_DATABASE_ID),
      String(ENV_VARIABLES.VITE_COLLECTION_ID_PROFILE),
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

export const searchProfilesByName = async (
  name: string,
): Promise<RandomUsers[] | undefined> => {
  const profileResult = await database.listDocuments(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_PROFILE),
    [Query.limit(5), Query.search('name', name)],
  );

  const objPromises = profileResult.documents.map((profile) => {
    return {
      userId: profile?.user_id,
      name: profile?.name,
      image: profile?.image,
    };
  });

  const result = await Promise.all(objPromises);
  return result;
};

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

export const getPostsByUser = async (userId: string) => {
  const response = await database.listDocuments(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_POST),
    [Query.equal('user_id', userId), Query.orderDesc('$id')],
  );
  const result = response.documents.map((doc) => {
    return {
      id: doc?.$id,
      userId: doc?.user_id,
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
    String(ENV_VARIABLES.VITE_BUCKET_ID),
    videoId,
    finalFile,
  );

  return result?.$id;
};

export const updateProfileImage = async (id: string, image: string) => {
  await database.updateDocument(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_PROFILE),
    id,
    {
      image: image,
    },
  );
};

export const updateProfile = async (id: string, name: string, bio: string) => {
  await database.updateDocument(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_PROFILE),
    id,
    {
      name: name,
      bio: bio,
    },
  );
};

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

export const getAllPosts = async () => {
  const response = await database.listDocuments(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_POST),
    [Query.orderDesc('$id')],
  );
  const documents = response.documents;

  const objPromises = documents.map(async (doc) => {
    const profile = await getProfileByUserId(doc?.user_id);
    const likes = await getLikesByPostId(doc.$id);
    const comments = await getCommentsByPostId(doc.$id);

    return {
      id: doc?.$id,
      userId: doc?.user_id,
      video_url: doc?.video_url,
      text: doc?.text,
      created_at: doc?.created_at,
      profile: {
        userId: profile?.userId,
        name: profile?.name,
        image: profile?.image,
      },
      likes,
      comments: comments.length,
    };
  });

  const result = await Promise.all(objPromises);
  return result;
};

export const getLikesByPostId = async (postId: string) => {
  const response = await database.listDocuments(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_LIKE),
    [Query.equal('post_id', postId)],
  );
  const documents = response.documents;
  const result = documents.map((doc) => {
    return {
      id: doc.$id,
      userId: doc.user_id,
      postId: doc.post_id,
    };
  });

  return result;
};

export const getCommentsByPostId = async (postId: string) => {
  const commentsResult = await database.listDocuments(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_COMMENT),
    [Query.equal('post_id', postId), Query.orderDesc('$id')],
  );

  const objPromises = commentsResult.documents.map(async (comment) => {
    const profile = await getProfileByUserId(comment.user_id);

    return {
      id: comment?.$id,
      userId: comment?.user_id,
      postId: comment?.post_id,
      text: comment?.text,
      created_at: comment?.created_at,
      profile: {
        userId: profile?.userId,
        name: profile?.name,
        image: profile?.image,
      },
    };
  });

  const result = await Promise.all(objPromises);
  return result.reverse();
};

export const createLike = async (userId: string, postId: string) => {
  const response = await database.createDocument(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_LIKE),
    ID.unique(),
    { user_id: userId, post_id: postId },
  );
  return {
    id: response.$id,
    userId: response.user_id,
    postId: response.post_id,
  };
};

export const deleteLike = async (id: string) => {
  await database.deleteDocument(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_LIKE),
    id,
  );
};

export const deleteComment = async (id: string) => {
  await database.deleteDocument(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_COMMENT),
    id,
  );
};

export const createComment = async (
  userId: string,
  postId: string,
  comment: string,
) => {
  await database.createDocument(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_COMMENT),
    ID.unique(),
    {
      user_id: userId,
      post_id: postId,
      text: comment,
      created_at: new Date().toISOString(),
    },
  );
};

export const deletePostById = async (postId: string, currentImage: string) => {
  const likes = await getLikesByPostId(postId);
  likes.forEach(async (like) => {
    await deleteLike(like.id);
  });

  const comments = await getCommentsByPostId(postId);
  comments.forEach(async (comment) => {
    await deleteComment(comment.id);
  });

  await database.deleteDocument(
    String(ENV_VARIABLES.VITE_DATABASE_ID),
    String(ENV_VARIABLES.VITE_COLLECTION_ID_POST),
    postId,
  );

  await storage.deleteFile(String(ENV_VARIABLES.VITE_BUCKET_ID), currentImage);
};
