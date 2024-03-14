import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { Link, useNavigate } from '@builder.io/qwik-city';
import moment from 'moment';
import { Image } from 'qwik-image';
import { StoreContext } from '../routes/layout';
import {
  createBucketUrl,
  createLike,
  deleteLike,
  deletePostById,
} from '../utils/actions';
import { Like, Profile } from './PostMain';
import { Post } from './PostUser';
import { FillHeartIcon } from './icons/FillHeartIcon';
import { LoaderIcon } from './icons/LoaderIcon';
import { MusicIcon } from './icons/MusicIcon';
import { TrashIcon } from './icons/TrashIcon';

type Props = {
  profile: Profile;
  post: Post;
  likes: Like[];
};

export const CommentsHeader = component$<Props>(({ profile, post, likes }) => {
  const navigate = useNavigate();
  const appStore = useContext(StoreContext);
  const isDeletingSig = useSignal<boolean>(false);
  const hasClickedLikeSig = useSignal<boolean>(false);
  const likeCounter = useSignal(likes.length);
  const userLikedSig = useSignal<Like | undefined>(
    likes.find((l) => l.userId === appStore.user?.userId),
  );

  const deletePost = $(async () => {
    const res = confirm('Are you sure you want to delete this post?');
    if (!res) return;

    isDeletingSig.value = true;

    try {
      await deletePostById(post.id, post.video_url);
      navigate(`/profile/${profile.userId}`);
    } catch (error) {
      console.log(error);
      isDeletingSig.value = false;
      alert(error);
    }
  });

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
    <>
      <div class="flex items-center justify-between px-8">
        <div class="flex items-center">
          <Link href={`/profile/${post.userId}`}>
            {profile.image ? (
              <Image
                class="rounded-full lg:mx-0 mx-auto"
                width="40"
                height="40"
                layout="constrained"
                src={createBucketUrl(profile.image)}
              />
            ) : (
              <div class="w-[40px] h-[40px] bg-gray-200 rounded-full"></div>
            )}
          </Link>
          <div class="ml-3 pt-0.5">
            <Link
              href={`/profile/${profile.userId}`}
              class="relative z-10 text-[17px] font-semibold hover:underline"
            >
              {profile.name}
            </Link>

            <div class="relative z-0 text-[13px] -mt-5 font-light">
              {profile.name}
              <span class="relative -top-[2px] text-[30px] pl-1 pr-0.5 ">
                .
              </span>
              <span class="font-medium">
                {moment(post.created_at).calendar()}
              </span>
            </div>
          </div>
        </div>

        {appStore.user?.userId === post.userId && (
          <div>
            {isDeletingSig.value ? (
              <LoaderIcon size="25" color="#9ca3af" />
            ) : (
              <button
                disabled={isDeletingSig.value}
                onClick$={() => deletePost()}
              >
                <TrashIcon />
              </button>
            )}
          </div>
        )}
      </div>

      <p class="px-8 mt-4 text-sm">{post.text}</p>

      <p class="flex item-center gap-2 px-8 mt-4 text-sm font-bold">
        <MusicIcon />
        original sound - {profile.name}
      </p>

      <div class="flex items-center px-8 mt-8">
        <div class="pb-4 text-center flex items-center">
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
              <LoaderIcon size="20" color="#9ca3af" />
            )}
          </button>

          <span class="text-xs pl-2 pr-4 text-gray-800 font-semibold">
            {likeCounter.value}
          </span>
        </div>
      </div>
    </>
  );
});
