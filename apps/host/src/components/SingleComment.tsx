import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import moment from 'moment';
import { Image } from 'qwik-image';
import { StoreContext } from '../routes/layout';
import { CommentWithProfile } from '../routes/post/[userId]/[postId]';
import { createBucketUrl, deleteComment } from '../utils/actions';
import { TrashIcon } from './icons/TrashIcon';

export type Props = {
  comment: CommentWithProfile;
};

export const SingleComment = component$<Props>(({ comment }) => {
  const appStore = useContext(StoreContext);
  const isDeletedSig = useSignal(false);

  const deleteThisComment = $(async () => {
    const res = confirm('Are you sure you want to delete this comment?');
    if (!res) return;

    try {
      await deleteComment(comment.id);
      isDeletedSig.value = true;
    } catch (error) {
      console.log(error);
      alert(error);
    }
  });

  return (
    <>
      {!isDeletedSig.value && (
        <div class="flex items-center justify-between px-8 mt-4">
          <div class="flex items-center relative w-full">
            <Link href={`/profile/${comment.profile.userId}`}>
              <Image
                class="absolute top-0 rounded-full lg:mx-0 mx-auto"
                width="40"
                height="40"
                layout="constrained"
                src={createBucketUrl(comment.profile.image)}
              />
            </Link>
            <div class="ml-14 pt-0.5 w-full">
              <div class="text-[18px] font-semibold flex items-center justify-between">
                <span class="flex items-center">
                  {comment?.profile?.name} -
                  <span class="text-[12px] text-gray-600 font-light ml-1">
                    {moment(comment?.created_at).calendar()}
                  </span>
                </span>

                {appStore.user?.userId === comment.profile.userId && (
                  <button onClick$={() => deleteThisComment()}>
                    <TrashIcon />
                  </button>
                )}
              </div>
              <p class="text-[15px] font-light">{comment.text}</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
});
