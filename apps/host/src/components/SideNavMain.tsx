import { component$, useContext } from '@builder.io/qwik';
import { useLocation } from '@builder.io/qwik-city';
import { StoreContext, useRandomUsers } from '../routes/layout';
import { MenuItemFollow } from './MenuItemFollow';
import { HomeIcon } from './icons/HomeIcon';
import { UsersIcon } from './icons/UsersIcon';
import { WebCamIcon } from './icons/WebCamIcon';

export const SideNavMain = component$(() => {
  const appStore = useContext(StoreContext);
  const location = useLocation();
  const pathname = location.url.pathname;
  const randomUsers = useRandomUsers();

  return (
    <div
      class={`fixed z-20 bg-white pt-[70px] h-full lg:border-r-0 border-r w-[75px] overflow-auto ${
        pathname === '/' ? 'lg:w-[310px]' : 'lg:w-[220px]'
      }`}
    >
      <div class="lg:w-full w-[55px] mx-auto">
        <div class="lg:w-full w-[55px] mx-auto">
          <a href="/">
            <div class="w-full flex items-center hover:bg-gray-100 p-2.5 rounded-md">
              <div class="flex items-center lg:mx-0 mx-auto">
                <HomeIcon />
                <p class="lg:block hidden pl-[9px] mt-0.5 font-semibold text-[17px] text-[#F02C56]">
                  For You
                </p>
              </div>
            </div>
          </a>
          <div class="w-full flex items-center hover:bg-gray-100 p-2.5 rounded-md">
            <div class="flex items-center lg:mx-0 mx-auto">
              <UsersIcon />
              <p class="lg:block hidden pl-[9px] mt-0.5 font-semibold text-[17px] text-[#000000]">
                Following
              </p>
            </div>
          </div>
          <div class="w-full flex items-center hover:bg-gray-100 p-2.5 rounded-md">
            <div class="flex items-center lg:mx-0 mx-auto">
              <WebCamIcon />
              <p class="lg:block hidden pl-[9px] mt-0.5 font-semibold text-[17px] text-[#000000]">
                LIVE
              </p>
            </div>
          </div>
          <div class="border-b lg:ml-2 mt-2" />
          <h3 class="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
            Suggested accounts
          </h3>

          <div class="lg:hidden block pt-3" />

          <div class="cursor-pointer">
            {randomUsers.value.map((user, index) => (
              <MenuItemFollow key={index} user={user} />
            ))}
          </div>

          <button class="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-[13px]">
            See all
          </button>

          {appStore.user?.userId ? (
            <div>
              <div class="border-b lg:ml-2 mt-2" />
              <h3 class="lg:block hidden text-xs text-gray-600 font-semibold pt-4 pb-2 px-2">
                Following accounts
              </h3>

              <div class="lg:hidden block pt-3" />
              <div class="cursor-pointer">
                {randomUsers.value.map((user, index) => (
                  <MenuItemFollow key={index} user={user} />
                ))}
              </div>
              <button class="lg:block hidden text-[#F02C56] pt-1.5 pl-2 text-[13px]">
                See more
              </button>
            </div>
          ) : null}
          <div class="lg:block hidden border-b lg:ml-2 mt-2" />
        </div>
      </div>
    </div>
  );
});
