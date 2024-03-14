import {
  $,
  NoSerialize,
  component$,
  noSerialize,
  useContext,
  useSignal,
} from '@builder.io/qwik';
import {
  LoaderIcon,
  OutlineCheckCircleIcon,
  OutlineCloseIcon,
} from '@qwik-tiktok-microfrontends/ui';
import { Image } from 'qwik-image';
import { KnifeIcon } from '../components/icons/KnifeIcon';
import { SolidCloudUploadIcon } from '../components/icons/SolidCloudUploadIcon';
import { createPost } from '../utils/actions';
import { UploadContext } from './layout';

export type UploadError = {
  type: string;
  message: string;
};

export default component$(() => {
  const appStore = useContext(UploadContext);

  const fileDisplaySig = useSignal<string>('');
  const captionSig = useSignal<string>('');
  const fileSig = useSignal<NoSerialize<File> | null>(null);
  const errorSig = useSignal<UploadError | null>(null);
  const isUploadingSig = useSignal<boolean>(false);

  const validate = $(() => {
    errorSig.value = null;
    let isError = false;

    if (!fileSig.value) {
      errorSig.value = { type: 'File', message: 'A video is required' };
      isError = true;
    } else if (!captionSig.value) {
      errorSig.value = { type: 'caption', message: 'A caption is required' };
      isError = true;
    }
    return isError;
  });

  const createNewPost = $(async () => {
    const isError = await validate();
    if (isError || !fileSig.value || !appStore?.user) {
      return;
    }
    isUploadingSig.value = true;

    try {
      await createPost(fileSig.value, appStore.user.userId, captionSig.value);
      location.href = `/profile/${appStore.user.id}`;
      isUploadingSig.value = false;
    } catch (error) {
      console.log(error);
      isUploadingSig.value = false;
      alert(error);
    }
  });

  return (
    <div class="mx-auto mt-[80px] mb-[40px] bg-white shadow-lg rounded-md py-6 z-50">
      <div class="flex justify-between border-b-gray-300 pb-4 border-b px-4 md:px-10">
        <div>
          <h1 class="text-[23px] font-semibold">Upload video</h1>
          <h2 class="text-gray-400 mt-1">Post a video to your account</h2>
        </div>
        <button
          onClick$={() => (location.href = '/')}
          class="hover:bg-gray-200 p-1 rounded-full h-[34px]"
        >
          <OutlineCloseIcon />
        </button>
      </div>

      <div class="mt-4 md:flex gap-6 px-4 md:px-10">
        {fileDisplaySig.value ? (
          <div class="md:mx-0 mx-auto mt-4 md:mb-12 mb-16 flex items-center justify-center w-full max-w-[260px] h-[540px] p-3 rounded-2xl cursor-pointer relative">
            {isUploadingSig.value ? (
              <div class="absolute flex items-center justify-center z-20 bg-black h-full w-full rounded-[50px] bg-opacity-50">
                <div class="mx-auto flex items-center justify-center gap-1">
                  <LoaderIcon />
                  <div class="text-white font-bold">Uploading...</div>
                </div>
              </div>
            ) : null}

            <Image
              class="absolute z-20 pointer-events-none"
              src="/images/mobile-case.png"
              width="260"
              height="544"
              layout="fixed"
            />
            <Image
              class="absolute right-4 bottom-6 z-20"
              width="90"
              height="60"
              layout="constrained"
              src="/images/tiktok-logo-white.png"
            />
            <video
              autoplay
              loop
              muted
              class="absolute rounded-xl object-cover z-10 p-[13px] w-full h-full"
              src={fileDisplaySig.value}
            />

            <div class="absolute -bottom-12 flex items-center justify-between z-50 rounded-xl border w-full p-2 border-gray-300">
              <div class="flex items-center truncate">
                <OutlineCheckCircleIcon />
                <p class="text-[11px] pl-1 truncate text-ellipsis">
                  {File.name}
                </p>
              </div>
              <button
                onClick$={() => {
                  fileDisplaySig.value = '';
                  fileSig.value = null;
                }}
                class="text-[11px] ml-2 font-semibold"
              >
                Change
              </button>
            </div>
          </div>
        ) : (
          <label
            for="fileInput"
            class="md:mx-0 mx-auto mt-4 mb-6 flex flex-col items-center justify-center w-full max-w-[260px] h-[544px] text-center p-3 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            <SolidCloudUploadIcon />
            <p class="mt-4 text-[17px]">Select video to upload</p>
            <p class="mt-1.5 text-gray-500 text-[13px]">
              Or drag and drop a file
            </p>
            <p class="mt-12 text-gray-400 text-sm">MP4</p>
            <p class="mt-2 text-gray-400 text-[13px]">Up to 30 minutes</p>
            <p class="mt-2 text-gray-400 text-[13px]">Less than 2 GB</p>
            <label
              for="fileInput"
              class="px-2 py-1.5 mt-8 text-white text-[15px] w-[80%] bg-[#F02C56] rounded-sm cursor-pointer"
            >
              Select file
            </label>
            <input
              type="file"
              id="fileInput"
              onChange$={(_, target) => {
                const files = target.files;

                if (files && files.length > 0) {
                  const file = files[0];
                  const fileUrl = URL.createObjectURL(file);
                  fileDisplaySig.value = fileUrl;
                  fileSig.value = noSerialize(file);
                }
              }}
              hidden
              accept=".webm"
            />
          </label>
        )}

        <div class="mt-4 mb-6">
          <div class="flex bg-[#F8F8F8] py-4 px-6">
            <div>
              <KnifeIcon />
            </div>
            <div>
              <div class="text-semibold text-[15px] mb-1.5">
                Divide videos and edit
              </div>
              <div class="text-semibold text-[13px] text-gray-400">
                You can quickly divide videos into multiple parts, remove
                redundant parts and turn landscape videos into portrait videos
              </div>
            </div>
            <div class="flex justify-end max-w-[130px] w-full h-full text-center my-auto">
              <button class="px-8 py-1.5 text-white text-[15px] bg-[#F02C56] rounded-sm">
                Edit
              </button>
            </div>
          </div>

          <div class="mt-5">
            <div class="flex items-center justify-between">
              <div class="mb-1 text-[15px]">Caption</div>
              <div class="text-gray-400 text-[12px]">
                {captionSig.value.length}/150
              </div>
            </div>
            <input
              maxLength={150}
              type="text"
              class="w-full border p-2.5 rounded-md focus:outline-none"
              bind:value={captionSig}
            />
          </div>

          <div class="flex gap-3">
            <button
              disabled={isUploadingSig.value}
              onClick$={() => {
                fileDisplaySig.value = '';
                fileSig.value = null;
                captionSig.value = '';
              }}
              class="px-10 py-2.5 mt-8 border text-[16px] hover:bg-gray-100 rounded-sm"
            >
              Discard
            </button>
            <button
              disabled={isUploadingSig.value}
              onClick$={() => createNewPost()}
              class="px-10 py-2.5 mt-8 border text-[16px] text-white bg-[#F02C56] rounded-sm"
            >
              {isUploadingSig.value ? <LoaderIcon /> : 'Post'}
            </button>
          </div>

          {errorSig.value ? (
            <div class="text-red-600 mt-4">{errorSig.value.message}</div>
          ) : null}
        </div>
      </div>
    </div>
  );
});
