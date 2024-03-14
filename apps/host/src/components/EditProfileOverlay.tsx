import {
  $,
  NoSerialize,
  component$,
  noSerialize,
  useContext,
  useSignal,
} from '@builder.io/qwik';
import { useNavigate } from '@builder.io/qwik-city';
import { StoreContext } from '../routes/layout';
import { showError } from '../utils';
import {
  changeUserImage,
  createBucketUrl,
  getProfileByUserId,
  updateProfile,
  updateProfileImage,
} from '../utils/actions';
import { Cropper } from './Cropper';
import { TextInput } from './TextInput';
import { LoaderIcon } from './icons/LoaderIcon';
import { OutlineCloseIcon } from './icons/OutlineCloseIcon';
import { PencilIcon } from './icons/PencilIcon';

export type CropperDimensions = {
  height: number;
  width: number;
  left: number;
  top: number;
};

export type ShowErrorObject = {
  type: string;
  message: string;
};

export const EditProfileOverlay = component$(() => {
  const appStore = useContext(StoreContext);
  const navigate = useNavigate();

  if (!appStore.user?.userId) {
    navigate('/');
  }

  const fileSig = useSignal<NoSerialize<File> | null>(null);
  const cropperSig = useSignal<CropperDimensions | null>(null);
  const uploadedImageSig = useSignal<string | null>(null);
  const userImageSig = useSignal<string | ''>(appStore.user!.image);
  const userNameSig = useSignal<string | ''>(appStore.user!.name);
  const userBioSig = useSignal<string | ''>(appStore.user!.bio);
  const isUpdatingSig = useSignal(false);
  const errorSig = useSignal<ShowErrorObject | null>(null);

  const validate = $(() => {
    errorSig.value = null;
    let isError = false;

    if (!userNameSig.value) {
      errorSig.value = { type: 'userName', message: 'A Username is required' };
      isError = true;
    }
    return isError;
  });

  const updateUserInfo = $(async () => {
    const isError = await validate();
    if (isError) return;

    try {
      isUpdatingSig.value = true;

      await updateProfile(
        appStore.user?.id || '',
        userNameSig.value,
        userBioSig.value,
      );

      appStore.user = await getProfileByUserId(appStore.user!.userId);
      appStore.isEditProfileOpen = false;

      navigate(location.href, { forceReload: true });
    } catch (error) {
      console.log(error);
    }
  });

  const cropAndUpdateImage = $(async () => {
    const isError = await validate();
    if (isError) return;

    try {
      if (!fileSig.value) {
        return alert('You have no file');
      }
      if (!cropperSig.value) {
        return alert('You have no file');
      }
      isUpdatingSig.value = true;

      const newImageId = await changeUserImage(fileSig.value, cropperSig.value);
      await updateProfileImage(appStore.user?.id || '', newImageId);

      appStore.user = await getProfileByUserId(appStore.user!.userId);
      appStore.isEditProfileOpen = false;
      isUpdatingSig.value = false;

      navigate(location.href, { forceReload: true });
    } catch (error) {
      console.log(error);
      isUpdatingSig.value = false;
      alert(error);
    }
  });

  return (
    <div class="fixed flex justify-center pt-14 md:pt-[105px] z-50 top-0 left-0 w-full h-full bg-black bg-opacity-50 overflow-auto">
      <div
        class={`relative bg-white w-full max-w-[700px] sm:h-[580px] h-[655px] mx-3 p-4 rounded-lg mb-10 ${
          !uploadedImageSig.value ? 'h-[655px]' : 'h-[580px]'
        }`}
      >
        <div class="absolute flex items-center justify-between w-full p-5 left-0 top-0 border-b border-b-gray-300">
          <h1 class="text-[22px] font-medium">Edit profile</h1>
          <button
            disabled={isUpdatingSig.value}
            onClick$={() => (appStore.isEditProfileOpen = false)}
            class="hover:bg-gray-200 p-1 rounded-full"
          >
            <OutlineCloseIcon />
          </button>
        </div>

        <div
          class={`h-[calc(500px-200px)] ${
            !uploadedImageSig.value ? 'mt-16' : 'mt-[58px]'
          }`}
        >
          {!uploadedImageSig.value ? (
            <div>
              <div class="flex flex-col border-b sm:h-[118px] h-[145px] px-1.5 py-2 w-full">
                <h3 class="font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center">
                  Profile photo
                </h3>

                <div class="flex items-center justify-center sm:-mt-6">
                  <label for="image" class="relative cursor-pointer">
                    <img
                      class="rounded-full"
                      width="95"
                      height="95"
                      src={createBucketUrl(userImageSig.value)}
                    />

                    <button class="absolute bottom-0 right-0 rounded-full bg-white shadow-xl border p-1 border-gray-300 inline-block w-[32px] h-[32px]">
                      <PencilIcon />
                    </button>
                  </label>
                  <input
                    class="hidden"
                    type="file"
                    id="image"
                    onChange$={(_, target) => {
                      const selectedFile = target.files && target.files[0];

                      if (selectedFile) {
                        fileSig.value = noSerialize(selectedFile);
                        uploadedImageSig.value =
                          URL.createObjectURL(selectedFile);
                      } else {
                        fileSig.value = null;
                        uploadedImageSig.value = null;
                      }
                    }}
                    accept="image/png, image/jpeg, image/jpg"
                  />
                </div>
              </div>

              <div class="flex flex-col border-b sm:h-[118px]  px-1.5 py-2 mt-1.5  w-full">
                <h3 class="font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center">
                  Name
                </h3>

                <div class="flex items-center justify-center sm:-mt-6">
                  <div class="sm:w-[60%] w-full max-w-md">
                    <TextInput
                      string={userNameSig.value}
                      placeholder="Username"
                      onUpdate$={(value) => {
                        userNameSig.value = value;
                      }}
                      inputType="text"
                      error={showError('userName', errorSig)}
                    />

                    <p
                      class={`relative text-[11px] text-gray-500 ${
                        errorSig.value ? 'mt-1' : 'mt-4'
                      }`}
                    >
                      Usernames can only contain letters, numbers, underscores,
                      and periods. Changing your username will also change your
                      profile link.
                    </p>
                  </div>
                </div>
              </div>

              <div class="flex flex-col sm:h-[120px]  px-1.5 py-2 mt-2 w-full">
                <h3 class="font-semibold text-[15px] sm:mb-0 mb-1 text-gray-700 sm:w-[160px] sm:text-left text-center">
                  Bio
                </h3>

                <div class="flex items-center justify-center sm:-mt-6">
                  <div class="sm:w-[60%] w-full max-w-md">
                    <textarea
                      cols={30}
                      rows={4}
                      bind:value={userBioSig}
                      maxLength={80}
                      class="resize-none w-full bg-[#F1F1F2] text-gray-800 border border-gray-300 rounded-md py-2.5 px-3 focus:outline-none"
                    ></textarea>
                    <p class="text-[11px] text-gray-500">
                      {userBioSig.value ? userBioSig.value.length : 0}/80
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div class="w-full max-h-[420px] mx-auto bg-black circle-stencil">
              <Cropper
                src={uploadedImageSig.value}
                onChange$={(dimensions: CropperDimensions) =>
                  (cropperSig.value = dimensions)
                }
              />
            </div>
          )}
        </div>

        <div class="absolute p-5 left-0 bottom-0 border-t border-t-gray-300 w-full">
          {!uploadedImageSig.value ? (
            <div class="flex items-center justify-end">
              <button
                disabled={isUpdatingSig.value}
                onClick$={() => (appStore.isEditProfileOpen = false)}
                class="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray-100"
              >
                <span class="px-2 font-medium text-[15px]">Cancel</span>
              </button>

              <button
                disabled={isUpdatingSig.value}
                onClick$={() => updateUserInfo()}
                class="flex items-center bg-[#F02C56] text-white border rounded-md ml-3 px-3 py-[6px]"
              >
                <span class="mx-4 font-medium text-[15px]">
                  {isUpdatingSig.value ? (
                    <LoaderIcon class="my-1 mx-2.5 animate-spin" />
                  ) : (
                    'Save'
                  )}
                </span>
              </button>
            </div>
          ) : (
            <div class="flex items-center justify-end">
              <button
                onClick$={() => (uploadedImageSig.value = null)}
                class="flex items-center border rounded-sm px-3 py-[6px] hover:bg-gray-100"
              >
                <span class="px-2 font-medium text-[15px]">Cancel</span>
              </button>

              <button
                onClick$={() => cropAndUpdateImage()}
                class="flex items-center bg-[#F02C56] text-white border rounded-md ml-3 px-3 py-[6px]"
              >
                <span class="mx-4 font-medium text-[15px]">
                  {isUpdatingSig.value ? (
                    <LoaderIcon class="my-1 mx-2.5 animate-spin" />
                  ) : (
                    'Apply'
                  )}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
