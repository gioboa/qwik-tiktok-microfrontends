import {
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';
import { Footer, Header } from '@qwik-tiktok-microfrontends/ui';

interface CheckoutStore {
  items: string[];
}

export const CheckoutContext = createContextId<CheckoutStore>('Todos');

export default component$(() => {
  useContextProvider(
    CheckoutContext,
    useStore<CheckoutStore>({
      items: ['Qwik', 'Microfrontends'],
    }),
  );

  return (
    <>
      <Header />
      <main class="min-h-screen mt-18 pt-10 bg-[#F8F8F8]">
        <Slot />
      </main>
      <Footer />
    </>
  );
});
