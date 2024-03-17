import { component$, useContext } from '@builder.io/qwik';
import { Link } from '@builder.io/qwik-city';
import {
  OutlinePlusIcon,
  SearchIcon,
  ThreeDotsVerticalIcon,
} from '@qwik-tiktok-microfrontends/ui';
import { Image } from 'qwik-image';
import { UploadContext } from '../routes/layout';
import { createBucketUrl } from '../utils/actions';

export const Header = component$(() => {
  const appStore = useContext(UploadContext);

  return (
    <div class="fixed bg-white z-30 flex items-center w-full border-b h-[60px]">
      <div class="flex items-center justify-between gap-6 w-full px-4 mx-auto max-w-[1150px]">
        <Link href="/">
          <div class="min-w-[115px] w-[115px] h-[30px]">
            <Image
              width="115"
              height="30"
              src="/images/tiktok-logo.png"
              layout="constrained"
            />
          </div>
        </Link>

        <div class="relative hidden md:flex items-center justify-end bg-[#F1F1F2] p-1 rounded-full max-w-[430px] w-full">
          <input
            type="text"
            class="w-full pl-3 my-2 bg-transparent placeholder-[#838383] text-[15px] focus:outline-none"
            placeholder="Search accounts"
          />

          <div class="px-3 py-1 flex items-center border-l border-l-gray-300">
            <SearchIcon />
          </div>
        </div>

        <div class="flex items-center gap-3 ">
          <button class="flex items-center border rounded-sm py-[6px] hover:bg-gray-100 pl-1.5">
            <OutlinePlusIcon />
            <span class="px-2 font-medium text-[15px]">Upload</span>
          </button>

          {!appStore.user?.userId ? (
            <div class="flex items-center">
              <button class="flex items-center bg-[#F02C56] text-white border rounded-md px-3 py-[6px]">
                <span class="whitespace-nowrap mx-4 font-medium text-[15px]">
                  Log in
                </span>
              </button>
              <ThreeDotsVerticalIcon />
            </div>
          ) : (
            <div class="flex items-center">
              <div class="relative">
                <button class="mt-1 border border-gray-200 rounded-full">
                  <img
                    class="rounded-full w-[35px] h-[35px]"
                    width={35}
                    height={35}
                    src={createBucketUrl(appStore.user.image || '')}
                  />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
