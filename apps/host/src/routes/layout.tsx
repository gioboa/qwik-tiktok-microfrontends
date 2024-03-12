import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Account } from 'appwrite';
import { AuthOverlay } from '../components/AuthOverlay';
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
  user?: UserStore;
};

export const StoreContext = createContextId<Store>('store-id');

export const useUser = routeLoader$(async ({ cookie }) => {
  if (!cookie.get(JWT_COOKIE_KEY)?.value) {
    return undefined;
  }
  try {
    if (cookie.get(JWT_COOKIE_KEY)?.value) {
      const cl = client(cookie.get(JWT_COOKIE_KEY)!.value);
      const response = await new Account(cl).get();
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
    user: useUser().value,
  });
  useContextProvider(StoreContext, appStore);

  return (
    <>
      <Header />
      <main class="min-h-screen mt-18 pt-10 bg-slate-900">
        <Slot />
      </main>
      {appStore.isLoginOpen && <AuthOverlay />}
      {JSON.stringify(appStore.user)}
      <Footer />
    </>
  );
});
