import { $, Slot, component$ } from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { useImageProvider } from 'qwik-image';
import { getRandomUsers } from '../utils/actions';

export const useRandomUsers = routeLoader$(async () => {
  return await getRandomUsers();
});

export default component$(() => {
  useImageProvider({
    imageTransformer$: $(({ src }) => src),
  });

  return <Slot />;
});
