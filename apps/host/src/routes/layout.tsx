import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';
import { AuthOverlay } from '../components/AuthOverlay';
import { Footer } from '../components/Footer';
import { Header } from '../components/Header';

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

export default component$(() => {
  const appStore = useStore<Store>({
    isLoginOpen: false,
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
