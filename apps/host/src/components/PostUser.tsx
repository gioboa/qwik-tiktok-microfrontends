import { component$, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import { createBucketUrl } from '../utils/actions';
import { OutlineLoadingIcon } from './icons/OutlineLoadingIcon';
import { SoundChartsIcon } from './icons/SoundChartsIcon';
import { WarningCircleIcon } from './icons/WarningCircleIcon';

type Props = {
  post: Post;
};

export type Post = {
  id: string;
  userId: string;
  video_url: string;
  text: string;
  created_at: string;
};

export const PostUser = component$<Props>(({ post }) => {
  const videoIsLoadingSig = useSignal(true);
  return (
    <div class="relative brightness-90 hover:brightness-[1.1] cursor-pointer">
      {videoIsLoadingSig.value && (
        <div class="absolute flex items-center justify-center top-0 left-0 aspect-[3/4] w-full object-cover rounded-md bg-black">
          <OutlineLoadingIcon />
        </div>
      )}
      {post.video_url && (
        <Link
          class={{ hidden: videoIsLoadingSig.value }}
          href={`/post/${post.userId}/${post.id}/`}
        >
          <video
            muted
            loop
            class="aspect-[3/4] object-cover rounded-md"
            src={createBucketUrl(post.video_url)}
            onMouseEnter$={(_, target) => target.play()}
            onMouseLeave$={(_, target) => target.pause()}
            onLoadedData$={() => (videoIsLoadingSig.value = false)}
          />
        </Link>
      )}
      <div class="px-1">
        <p class="text-gray-700 text-[15px] pt-1 break-words">{post.text}</p>
        <div class="flex items-center gap-1 -ml-1 text-gray-600 font-bold text-xs">
          <SoundChartsIcon />
          3%
          <WarningCircleIcon />
        </div>
      </div>
    </div>
  );
});
