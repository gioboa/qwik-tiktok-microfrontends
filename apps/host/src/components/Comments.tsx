import { $, QRL, component$, useContext, useSignal } from '@builder.io/qwik';
import { LoaderIcon } from '@qwik-tiktok-microfrontends/ui';
import { StoreContext } from '../routes/layout';
import { CommentWithProfile } from '../routes/post/[userId]/[postId]';
import { createComment } from '../utils/actions';
import { SingleComment } from './SingleComment';

type Props = {
  postId: string;
  comments: CommentWithProfile[];
  refreshComments$: QRL<() => void>;
};

export const Comments = component$<Props>(
  ({ postId, comments, refreshComments$ }) => {
    const appStore = useContext(StoreContext);
    const commentSig = useSignal<string>('');
    const isUploadingSig = useSignal<boolean>(false);
    const inputFocusedSig = useSignal<boolean>(false);

    const addComment = $(async () => {
      try {
        isUploadingSig.value = true;
        await createComment(
          appStore.user?.userId || '',
          postId,
          commentSig.value,
        );
        await refreshComments$();
        commentSig.value = '';
        isUploadingSig.value = false;
      } catch (error) {
        console.log(error);
        alert(error);
      }
    });

    return (
      <>
        <div class="relative bg-[#F8F8F8] z-0 w-full h-[calc(100%-140px)] border-t-2 overflow-auto">
          <div class="pt-2" />

          {comments.length < 1 ? (
            <div class="text-center mt-6 text-xl text-gray-500">
              No comments...
            </div>
          ) : (
            <div>
              {comments.map((comment, index) => (
                <SingleComment key={index} comment={comment} />
              ))}
            </div>
          )}

          <div class="mb-28" />
        </div>

        <div class="absolute flex items-center justify-between bottom-0 bg-white h-[85px] lg:max-w-[550px] w-full py-5 px-8 border-t-2">
          {appStore.user?.userId && (
            <>
              <div
                class={`bg-[#F1F1F2] flex items-center rounded-lg w-full lg:max-w-[420px] ${
                  inputFocusedSig.value
                    ? 'border-2 border-gray-400'
                    : 'border-2 border-[#F1F1F2]'
                }`}
              >
                <input
                  onFocus$={() => (inputFocusedSig.value = true)}
                  onBlur$={() => (inputFocusedSig.value = false)}
                  bind:value={commentSig}
                  class="bg-[#F1F1F2] text-[14px] focus:outline-none w-full lg:max-w-[420px] p-2 rounded-lg"
                  type="text"
                  placeholder="Add comment..."
                  onKeyPress$={(e) => {
                    if (e.key === 'Enter') {
                      addComment();
                    }
                  }}
                />
              </div>
              {isUploadingSig.value ? (
                <LoaderIcon color="#9ca3af" size="35" />
              ) : (
                <button
                  disabled={!commentSig.value}
                  onClick$={() => addComment()}
                  class={`font-semibold text-sm ml-5 pr-1 ${
                    commentSig.value
                      ? 'text-[#F02C56] cursor-pointer'
                      : 'text-gray-400'
                  }`}
                >
                  Post
                </button>
              )}
            </>
          )}
        </div>
      </>
    );
  },
);
