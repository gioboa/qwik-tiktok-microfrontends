import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';
import { routeLoader$, useLocation } from '@builder.io/qwik-city';
import { Account } from 'appwrite';
import { useImageProvider } from 'qwik-image';
import { AuthOverlay } from '../components/AuthOverlay';
import { EditProfileOverlay } from '../components/EditProfileOverlay';
import { Header } from '../components/Header';
import { SideNavMain } from '../components/SideNavMain';
import {
  getPostsByUser,
  getProfileByUserId,
  getRandomUsers,
} from '../utils/actions';
import { client } from '../utils/AppWriteClient';
import { JWT_COOKIE_KEY } from '../utils/constants';

export type UserStore = {
  id: string;
  userId: string;
  name: string;
  image: string;
  bio: string;
};

type Store = {
  isLoginOpen: boolean;
  isEditProfileOpen: boolean;
  user?: UserStore;
};

export const StoreContext = createContextId<Store>('store-id');

export const useRandomUsers = routeLoader$(async () => {
  return await getRandomUsers();
});

export const useGetPostsByUser = routeLoader$(async ({ params }) => {
  return await getPostsByUser(params.userId);
});

export const useUser = routeLoader$(async ({ cookie }) => {
  if (!cookie.get(JWT_COOKIE_KEY)?.value) {
    return undefined;
  }
  try {
    if (cookie.get(JWT_COOKIE_KEY)?.value) {
      const cli = client(cookie.get(JWT_COOKIE_KEY)!.value);
      const response = await new Account(cli).get();
      const profile = await getProfileByUserId(response?.$id);
      return profile;
    }
  } catch {
    return undefined;
  }
});

export default component$(() => {
  const location = useLocation();
  const appStore = useStore<Store>({
    isLoginOpen: false,
    isEditProfileOpen: false,
    user: useUser().value,
  });
  useContextProvider(StoreContext, appStore);

  useImageProvider({
    imageTransformer$: $(({ src }) => src),
  });

  return location.url.pathname.startsWith('/post/') ? (
    <Slot />
  ) : (
    <div class="h-full w-full">
      {location.url.pathname === '/upload/' && (
        <div class="absolute h-full w-full bg-gray-400 opacity-10 z-40" />
      )}
      <Header />
      <div
        class={`flex justify-between mx-auto w-full lg:px-2.5 px-0 ${
          location.url.pathname === '/' ? 'max-w-[1140px]' : ''
        }`}
      >
        <SideNavMain />
        <Slot />
      </div>
      {appStore.isLoginOpen && <AuthOverlay />}
      {appStore.isEditProfileOpen && <EditProfileOverlay />}
    </div>
  );
});
