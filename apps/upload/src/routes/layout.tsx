import {
  $,
  component$,
  createContextId,
  Slot,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';
import { RequestHandler, routeLoader$ } from '@builder.io/qwik-city';
import { Account } from 'appwrite';
import { useImageProvider } from 'qwik-image';
import { TOKEN_COOKIE_KEY } from 'shared/constants';
import { Header } from '../components/Header';
import { getProfileByUserId } from '../utils/actions';
import { client } from '../utils/AppWriteClient';

type UploadStore = {
  user?: UserStore;
};

export type UserStore = {
  id: string;
  userId: string;
  name: string;
  image: string;
  bio: string;
};

export const UploadContext = createContextId<UploadStore>('upload-id');

export const extractToken = (request: Request) =>
  request.headers.get(TOKEN_COOKIE_KEY)?.replace(TOKEN_COOKIE_KEY + '=', '');

export const onRequest: RequestHandler = async ({ redirect, request }) => {
  const token = extractToken(request);
  if (!token) {
    throw redirect(307, 'http://localhost:5173/');
  }
};

export const useUser = routeLoader$(async ({ request, error }) => {
  try {
    const token = extractToken(request);
    if (token) {
      const cli = client(token);
      const response = await new Account(cli).get();
      const profile = await getProfileByUserId(response?.$id);
      return profile;
    }
  } catch {
    throw error(403, 'Forbidden');
  }
});

export default component$(() => {
  const appStore = useStore<UploadStore>({
    user: useUser().value,
  });
  useContextProvider(UploadContext, appStore);

  useImageProvider({
    imageTransformer$: $(({ src }) => src),
  });

  return (
    <div class="h-full w-full">
      <Header />
      <div class="absolute h-full w-full bg-black opacity-50 z-40" />
      <div class="flex justify-between mx-auto w-full lg:px-2.5 px-0 max-w-[1140px]">
        <Slot />
      </div>
    </div>
  );
});
