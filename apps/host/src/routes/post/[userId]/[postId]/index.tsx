import { $, component$, useSignal } from '@builder.io/qwik';
import {
  Link,
  routeLoader$,
  useLocation,
  useNavigate,
} from '@builder.io/qwik-city';
import { Image } from 'qwik-image';
import { Comments } from '../../../../components/Comments';
import { CommentsHeader } from '../../../../components/CommentsHeader';
import { DownIcon } from '../../../../components/icons/DownIcon';
import { OutlineCloseIcon } from '../../../../components/icons/OutlineCloseIcon';
import { UpIcon } from '../../../../components/icons/UpIcon';
import {
  createBucketUrl,
  getCommentsByPostId,
  getLikesByPostId,
  getProfileByUserId,
} from '../../../../utils/actions';
import { useGetPostsByUser } from '../../../layout';

export interface CommentWithProfile {
  id: string;
  userId: string;
  postId: string;
  text: string;
  created_at: string;
  profile: {
    userId: string;
    name: string;
    image: string;
  };
}

export const useGetCommentsByPostId = routeLoader$(async ({ params }) => {
  return await getCommentsByPostId(params.postId);
});

export const useGetLikesByPostId = routeLoader$(async ({ params }) => {
  return await getLikesByPostId(params.postId);
});

export const useGetProfileByUserId = routeLoader$(async ({ params }) => {
  return await getProfileByUserId(params.userId);
});

export default component$(() => {
  const navigate = useNavigate();
  const location = useLocation();
  const posts = useGetPostsByUser();
  const likes = useGetLikesByPostId();
  const profile = useGetProfileByUserId();
  const commentsSig = useSignal(useGetCommentsByPostId().value);
  const index = posts.value.findIndex((p) => p.id === location.params.postId);
  const currentPost = posts.value[index];

  const refreshComments = $(async () => {
    commentsSig.value = await getCommentsByPostId(location.params.postId);
  });

  return (
    <div class="lg:flex justify-between w-full h-screen bg-black overflow-auto">
      <div class="lg:w-[calc(100%-540px)] h-full relative">
        <Link
          href={`/profile/${location.params?.userId}`}
          class="absolute text-white z-20 m-5 rounded-full bg-gray-700 p-1.5 hover:bg-gray-800"
        >
          <OutlineCloseIcon />
        </Link>

        <div>
          <button
            disabled={index === 0}
            onClick$={() =>
              navigate(
                `/post/${location.params.userId}/${posts.value[index - 1].id}/`,
              )
            }
            class="absolute z-20 right-4 top-4 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800  disabled:cursor-not-allowed disabled:bg-black"
          >
            <UpIcon />
          </button>
          <button
            disabled={index === posts.value.length - 1}
            onClick$={() =>
              navigate(
                `/post/${location.params.userId}/${posts.value[index + 1].id}/`,
              )
            }
            class="absolute z-20 right-4 top-20 flex items-center justify-center rounded-full bg-gray-700 p-1.5 hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-black"
          >
            <DownIcon />
          </button>
        </div>

        <Image
          class="absolute z-20 top-[18px] left-[70px] rounded-full lg:mx-0 mx-auto"
          width="45"
          height="45"
          layout="constrained"
          src="/images/tiktok-logo-small.png"
        />

        {currentPost?.video_url && (
          <video
            class="fixed object-cover w-full my-auto z-[0] h-screen"
            src={createBucketUrl(currentPost.video_url)}
          />
        )}

        <div class="bg-black bg-opacity-70 lg:min-w-[480px] z-10 relative">
          {currentPost?.video_url && (
            <video
              autoPlay
              controls
              loop
              muted
              class="h-screen mx-auto"
              src={createBucketUrl(currentPost.video_url)}
              onMouseEnter$={(_, target) => target.play()}
              onMouseLeave$={(_, target) => target.pause()}
            />
          )}
        </div>
      </div>

      <div class="lg:max-w-[550px] relative w-full h-full bg-white">
        <div class="py-7" />

        {currentPost && (
          <CommentsHeader
            profile={profile.value}
            likes={likes.value}
            post={currentPost}
          />
        )}

        <Comments
          postId={location.params.postId}
          comments={commentsSig.value}
          refreshComments$={refreshComments}
        />
      </div>
    </div>
  );
});
