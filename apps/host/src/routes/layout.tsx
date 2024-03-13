import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Account } from 'appwrite';
import { useImageProvider } from 'qwik-image';
import { AuthOverlay } from '../components/AuthOverlay';
import { EditProfileOverlay } from '../components/EditProfileOverlay';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';
import { getProfileByUserId } from '../utils/actions';
import { client } from '../utils/AppWriteClient';
import { JWT_COOKIE_KEY } from '../utils/constants';

export type UserStore = {
  id: string;
  user_id: string;
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
  const appStore = useStore<Store>({
    isLoginOpen: false,
    isEditProfileOpen: false,
    user: useUser().value,
  });
  useContextProvider(StoreContext, appStore);

  useImageProvider({
    imageTransformer$: $(({ src }) => src),
  });

  return (
    <>
      <Header />
      <main class="min-h-screen pt-20 px-8 bg-[#F8F8F8]">
        <Slot />
      </main>
      {appStore.isLoginOpen && <AuthOverlay />}
      {appStore.isEditProfileOpen && <EditProfileOverlay />}
      <Footer />
    </>
  );
});
