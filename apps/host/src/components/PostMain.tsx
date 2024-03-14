import { component$ } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { Image } from 'qwik-image';
import { createBucketUrl } from '../utils/actions';
import { PostMainLikes } from './PostMainLikes';
import { FillHeartIcon } from './icons/FillHeartIcon';
import { MusicIcon } from './icons/MusicIcon';

export interface Props {
  post: PostWithInfo;
}

export type PostWithInfo = {
  id: string;
  userId: string;
  video_url: string;
  text: string;
  created_at: string;
  profile: Profile;
  likes: Like[];
  comments: number;
};

export type Profile = {
  userId: string;
  name: string;
  image: string;
};

export type Like = {
  id: string;
  userId: string;
  postId: string;
};

export const PostMain = component$<Props>(({ post }) => {
  return (
    <>
      <div class="flex border-b py-6">
        <div class="cursor-pointer">
          <Image
            class="rounded-full max-h-[60px]"
            width="60"
            height="60"
            layout="constrained"
            src={createBucketUrl(post?.profile?.image)}
          />
        </div>

        <div class="pl-3 w-full px-4">
          <div class="flex items-center justify-between pb-0.5">
            <Link href={`/profile/${post.profile.userId}`}>
              <span class="font-bold hover:underline cursor-pointer">
                {post.profile.name}
              </span>
            </Link>

            <button class="border text-[15px] px-[21px] py-0.5 border-[#F02C56] text-[#F02C56] hover:bg-[#ffeef2] font-semibold rounded-md">
              Follow
            </button>
          </div>
          <p class="text-[15px] pb-0.5 break-words md:max-w-[400px] max-w-[300px]">
            {post.text}
          </p>
          <p class="text-[14px] text-gray-500 pb-0.5">
            #fun #cool #SuperAwesome
          </p>
          <p class="text-[14px] pb-0.5 flex items-center font-semibold">
            <MusicIcon />
            <span class="px-1">original sound - AWESOME</span>
            <FillHeartIcon />
          </p>

          <div class="mt-2.5 flex">
            <div class="relative min-h-[480px] max-h-[580px] max-w-[260px] flex items-center bg-black rounded-xl cursor-pointer">
              <Link href={`/post/${post.userId}/${post.id}/`}>
                <video
                  id={`video-${post.id}`}
                  loop
                  controls
                  muted
                  class="rounded-xl object-cover mx-auto h-full"
                  src={createBucketUrl(post?.video_url)}
                  onMouseEnter$={(_, target) => target.play()}
                  onMouseLeave$={(_, target) => target.pause()}
                />
              </Link>
              <Image
                class="absolute right-2 bottom-10"
                width="90"
                layout="constrained"
                src="/images/tiktok-logo-white.png"
              />
            </div>

            <PostMainLikes post={post} />
          </div>
        </div>
      </div>
    </>
  );
});
