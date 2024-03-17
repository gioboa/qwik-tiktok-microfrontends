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
import { TOKEN_COOKIE_KEY } from 'shared/constants';
import { remotes } from 'shared/remotes';
import { AuthOverlay } from '../components/AuthOverlay';
import { EditProfileOverlay } from '../components/EditProfileOverlay';
import { Header } from '../components/Header';
import RemoteMfe from '../components/RemoteMfe';
import { getPostsByUser, getProfileByUserId } from '../utils/actions';
import { client } from '../utils/AppWriteClient';

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

export const useGetPostsByUser = routeLoader$(async ({ params }) => {
  return await getPostsByUser(params.userId);
});

export const useUser = routeLoader$(async ({ cookie }) => {
  if (!cookie.get(TOKEN_COOKIE_KEY)?.value) {
    return undefined;
  }
  try {
    if (cookie.get(TOKEN_COOKIE_KEY)?.value) {
      const cli = client(cookie.get(TOKEN_COOKIE_KEY)!.value);
      const response = await new Account(cli).get();
      const profile = await getProfileByUserId(response?.$id);
      return profile;
    }
  } catch {
    return undefined;
  }
});

export const useToken = routeLoader$(({ cookie }) => {
  return cookie.get(TOKEN_COOKIE_KEY)?.value;
});

export default component$(() => {
  const location = useLocation();
  const token = useToken();
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
      <Header />
      <div class="flex justify-between mx-auto w-full lg:px-2.5 px-0 max-w-[1140px]">
        <RemoteMfe
          remote={remotes.recommender}
          removeLoader={true}
          token={token.value}
        />
        <Slot />
      </div>
      {appStore.isLoginOpen && <AuthOverlay />}
      {appStore.isEditProfileOpen && <EditProfileOverlay />}
    </div>
  );
});
