import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { StoreContext } from '../routes/layout';
import { randomInt } from '../utils';
import { createLike, deleteLike } from '../utils/actions';
import { Like, PostWithInfo } from './PostMain';
import { CommentsIcon } from './icons/CommentsIcon';
import { FillHeartIcon } from './icons/FillHeartIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { ShareIcon } from './icons/ShareIcon';

export type Props = {
  post: PostWithInfo;
};

export const PostMainLikes = component$<Props>(({ post }) => {
  const navigate = useNavigate();
  const appStore = useContext(StoreContext);
  const hasClickedLikeSig = useSignal<boolean>(false);
  const likeCounter = useSignal(post.likes.length);
  const userLikedSig = useSignal<Like | undefined>(
    post.likes.find((l) => l.userId === appStore.user?.userId),
  );

  const likeOrUnlike = $(async () => {
    if (!appStore.user) return;

    hasClickedLikeSig.value = true;
    if (userLikedSig.value) {
      await deleteLike(userLikedSig.value.id);
      likeCounter.value -= 1;
      userLikedSig.value = undefined;
    } else {
      userLikedSig.value = await createLike(
        appStore.user?.userId || '',
        post?.id,
      );
      likeCounter.value += 1;
    }
    hasClickedLikeSig.value = false;
  });

  return (
    <div id={`PostMainLikes-${post?.id}`} class="relative mr-[75px]">
      <div class="absolute bottom-0 pl-2">
        <div class="pb-4 text-center">
          <button
            disabled={hasClickedLikeSig.value}
            onClick$={() => likeOrUnlike()}
            class="rounded-full bg-gray-200 p-2 cursor-pointer"
          >
            {!hasClickedLikeSig.value ? (
              userLikedSig.value ? (
                <FillHeartIcon color="#ff2626" />
              ) : (
                <FillHeartIcon />
              )
            ) : (
              <LoaderIcon />
            )}
          </button>
          <span class="text-xs text-gray-800 font-semibold">
            {likeCounter.value}
          </span>
        </div>

        <button
          onClick$={() =>
            navigate(`/post/${post?.profile?.userId}/${post?.id}/`)
          }
          class="pb-4 text-center"
        >
          <div class="rounded-full bg-gray-200 p-2 cursor-pointer">
            <CommentsIcon />
          </div>
          <span class="text-xs text-gray-800 font-semibold">
            {post.comments}
          </span>
        </button>

        <button class="text-center">
          <div class="rounded-full bg-gray-200 p-2 cursor-pointer">
            <ShareIcon />
          </div>
          <span class="text-xs text-gray-800 font-semibold">
            {randomInt(100, 400)}
          </span>
        </button>
      </div>
    </div>
  );
});
