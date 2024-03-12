import { component$, useContext, useSignal } from '@builder.io/qwik';
import { Link, useLocation, useNavigate } from '@builder.io/qwik-city';
import { StoreContext } from '../routes/layout';
import { createBucketUrl } from '../utils/actions';
import { LogOutIcon } from './icons/LogOutIcon';
import { OutlinePlusIcon } from './icons/OutlinePlusIcon';
import { SearchIcon } from './icons/SearchIcon';
import { ThreeDotsVerticalIcon } from './icons/ThreeDotsVerticalIcon';
import { UserIcon } from './icons/UserIcon';

export const Header = component$(() => {
  const location = useLocation();
  const appStore = useContext(StoreContext);
  const navigate = useNavigate();

  //const [searchProfiles, setSearchProfiles] = useState<RandomUsers[]>([]);
  const showMenuSig = useSignal<boolean>(false);

  // const handleSearchName = debounce(
  //   async (event: { target: { value: string } }) => {
  //     if (event.target.value == '') return setSearchProfiles([]);

  //     try {
  //       const result = await useSearchProfilesByName(event.target.value);
  //       if (result) return setSearchProfiles(result);
  //       setSearchProfiles([]);
  //     } catch (error) {
  //       console.log(error);
  //       setSearchProfiles([]);
  //       alert(error);
  //     }
  //   },
  //   500,
  // );

  // const goTo = () => {
  //   if (!userContext?.user) return setIsLoginOpen(true);
  //   router.push('/upload');
  // };

  return (
    <div class="fixed bg-white z-30 flex items-center w-full border-b h-[60px]">
      <div
        class={`flex items-center justify-between gap-6 w-full px-4 mx-auto ${
          location.url.pathname === '/' ? 'max-w-[1150px]' : ''
        }`}
      >
        <Link href="/">
          <div class="min-w-[115px] w-[115px]">
            <img width="115" height="30" src="./tiktok-logo.png" />
          </div>
        </Link>

        <div class="relative hidden md:flex items-center justify-end bg-[#F1F1F2] p-1 rounded-full max-w-[430px] w-full">
          <input
            type="text"
            onChange$={() => {
              console.log('handleSearchName');
            }}
            class="w-full pl-3 my-2 bg-transparent placeholder-[#838383] text-[15px] focus:outline-none"
            placeholder="Search accounts"
          />

          {/* {searchProfiles.length > 0 ? (
            <div class="absolute bg-white max-w-[910px] h-auto w-full z-20 left-0 top-12 border p-1">
              {searchProfiles.map((profile, index) => (
                <div class="p-1" key={index}>
                  <Link
                    href={`/profile/${profile?.id}`}
                    class="flex items-center justify-between w-full cursor-pointer hover:bg-[#F12B56] p-1 px-2 hover:text-white"
                  >
                    <div class="flex items-center">
                      <img
                        class="rounded-md"
                        width="40"
                        src={useCreateBucketUrl(profile?.image)}
                      />
                      <div class="truncate ml-2">{profile?.name}</div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ) : null} */}

          <div class="px-3 py-1 flex items-center border-l border-l-gray-300">
            <SearchIcon />
          </div>
        </div>

        <div class="flex items-center gap-3 ">
          <button
            onClick$={() => {
              console.log('goTo()');
            }}
            class="flex items-center border rounded-sm py-[6px] hover:bg-gray-100 pl-1.5"
          >
            <OutlinePlusIcon />
            <span class="px-2 font-medium text-[15px]">Upload</span>
          </button>

          {!appStore.user?.id ? (
            <div class="flex items-center">
              <button
                onClick$={() => {
                  appStore.isLoginOpen = true;
                }}
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
                        // await userContext?.logout();
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
