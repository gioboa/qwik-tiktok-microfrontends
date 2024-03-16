import {
  component$,
  createContextId,
  useContextProvider,
  useStore,
} from '@builder.io/qwik';
import { routeLoader$ } from '@builder.io/qwik-city';
import { Account } from 'appwrite';
import { TOKEN_COOKIE_KEY } from 'shared/constants';
import { client } from '../utils/AppWriteClient';
import { getProfileByUserId } from '../utils/actions';

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

export const UploadContext = createContextId<UploadStore>('recommender-id');

export const extractToken = (request: Request) =>
  request.headers.get(TOKEN_COOKIE_KEY)?.replace(TOKEN_COOKIE_KEY + '=', '');

export const useUser = routeLoader$(async ({ request }) => {
  try {
    const token = extractToken(request);
    console.log('token', token);
    if (token) {
      const cli = client(token);
      const response = await new Account(cli).get();
      const profile = await getProfileByUserId(response?.$id);
      return profile;
    }
  } catch {
    return undefined;
  }
});

export default component$(() => {
  const appStore = useStore<UploadStore>({
    user: useUser().value,
  });
  useContextProvider(UploadContext, appStore);

  return <div class="h-full w-full">{appStore.user?.name} - recommender</div>;
});
