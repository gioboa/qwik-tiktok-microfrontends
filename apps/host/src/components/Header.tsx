import { component$, useContext, useSignal, useTask$ } from '@builder.io/qwik';
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city';
import { StoreContext } from '../routes/layout';
import { createBucketUrl, searchProfilesByName } from '../utils/actions';
import { LogOutIcon } from './icons/LogOutIcon';
import { OutlinePlusIcon } from './icons/OutlinePlusIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ThreeDotsVerticalIcon } from './icons/ThreeDotsVerticalIcon';
import { UserIcon } from './icons/UserIcon';

export type RandomUsers = {
  id: string;
  name: string;
  image: string;
};

export const Header = component$(() => {
  const location = useLocation();
  const appStore = useContext(StoreContext);
  const navigate = useNavigate();
  const showMenuSig = useSignal<boolean>(false);
  const searchProfilesSig = useSignal<RandomUsers[]>([]);
  const searchValue = useSignal('');

  useTask$(({ track, cleanup }) => {
    track(() => searchValue.value);

    const debounced = setTimeout(async () => {
      const result = await searchProfilesByName(searchValue.value);
      if (result) {
        searchProfilesSig.value = result;
      }
    }, 500);

    cleanup(() => clearTimeout(debounced));
  });

  return (
    <div class="fixed bg-white z-30 flex items-center w-full border-b h-[60px]">
      <div
        class={`flex items-center justify-between gap-6 w-full px-4 mx-auto ${
          location.url.pathname === '/' ? 'max-w-[1150px]' : ''
        }`}
      >
        <Link href="/">
          <div class="min-w-[115px] w-[115px]">
            <img width="115" height="30" src="/images/tiktok-logo.png" />
          </div>
        </Link>

        <div class="relative hidden md:flex items-center justify-end bg-[#F1F1F2] p-1 rounded-full max-w-[430px] w-full">
          <input
            type="text"
            bind:value={searchValue}
            onFocus$={() => (searchProfilesSig.value = [])}
            class="w-full pl-3 my-2 bg-transparent placeholder-[#838383] text-[15px] focus:outline-none"
            placeholder="Search accounts"
          />

          {searchProfilesSig.value.length > 0 && (
            <div class="absolute bg-white max-w-[910px] h-auto w-full z-20 left-0 top-12 border p-1">
              {searchProfilesSig.value.map((profile, index) => (
                <div class="p-1" key={index}>
                  <button
                    class="flex items-center justify-between w-full cursor-pointer hover:bg-[#F12B56] p-1 px-2 hover:text-white"
                    onClick$={() => {
                      searchProfilesSig.value = [];
                      searchValue.value = '';
                      navigate(`/profile/${profile?.id}`);
                    }}
                  >
                    <div class="flex items-center">
                      <img
                        class="rounded-md"
                        height="35"
                        width="35"
                        src={createBucketUrl(profile?.image)}
                      />
                      <div class="truncate ml-2">{profile?.name}</div>
                    </div>
                  </button>
                </div>
              ))}
            </div>
          )}

          <div class="px-3 py-1 flex items-center border-l border-l-gray-300">
            <SearchIcon />
          </div>
        </div>

        <div class="flex items-center gap-3 ">
          <button
            onClick$={() => {
              if (!appStore.user) {
                return (appStore.isLoginOpen = true);
              }
              navigate('/upload/');
            }}
            class="flex items-center border rounded-sm py-[6px] hover:bg-gray-100 pl-1.5"
          >
            <OutlinePlusIcon />
            <span class="px-2 font-medium text-[15px]">Upload</span>
          </button>

          {!appStore.user?.id ? (
            <div class="flex items-center">
              <button
                onClick$={() => (appStore.isLoginOpen = true)}
                class="flex items-center bg-[#F02C56] text-white border rounded-md px-3 py-[6px]"
              >
                <span class="whitespace-nowrap mx-4 font-medium text-[15px]">
                  Log in
                </span>
              </button>
              <ThreeDotsVerticalIcon />
            </div>
          ) : (
            <div class="flex items-center">
              <div class="relative">
                <button
                  onClick$={() => (showMenuSig.value = !showMenuSig.value)}
                  class="mt-1 border border-gray-200 rounded-full"
                >
                  <img
                    class="rounded-full w-[35px] h-[35px]"
                    width={35}
                    height={35}
                    src={createBucketUrl(appStore.user.image || '')}
                  />
                </button>

                {showMenuSig.value ? (
                  <div class="absolute bg-white rounded-lg py-1.5 w-[200px] shadow-xl border top-[40px] right-0">
                    <button
                      onClick$={() => {
                        navigate(`/profile/${appStore.user?.id}`);
                        showMenuSig.value = false;
                      }}
                      class="flex items-center w-full justify-start py-3 px-2 hover:bg-gray-100 cursor-pointer"
                    >
                      <UserIcon />
                      <span class="pl-2 font-semibold text-sm">Profile</span>
                    </button>
                    <button
                      onClick$={async () => {
                        appStore.user = undefined;
                        showMenuSig.value = false;
                      }}
                      class="flex items-center justify-start w-full py-3 px-1.5 hover:bg-gray-100 border-t cursor-pointer"
                    >
                      <LogOutIcon />
                      <span class="pl-2 font-semibold text-sm">Log out</span>
                    </button>
                  </div>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
});
