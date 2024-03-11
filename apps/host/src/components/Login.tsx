import { $, component$, useContext, useSignal } from '@builder.io/qwik';
import { StoreContext } from '../routes/layout';
import { account } from '../utils/AppWriteClient';
import { getProfileByUserId } from '../utils/actions';
import { Loader } from './Loader';
import { TextInput } from './TextInput';

export interface ShowErrorObject {
  type: string;
  message: string;
}

export const Login = component$(() => {
  const appStore = useContext(StoreContext);

  //const contextUser = useUser();

  const loading = useSignal<boolean>(false);
  const email = useSignal<string | ''>('');
  const password = useSignal<string | ''>('');
  const error = useSignal<ShowErrorObject | null>(null);

  const showError = (type: string) => {
    if (
      error &&
      Object.entries(error).length > 0 &&
      error.value &&
      error.value!.type === type
    ) {
      return error.value.message;
    }
    return '';
  };

  const validate = $(() => {
    error.value = null;
    let isError = false;

    if (!email.value) {
      error.value = { type: 'email', message: 'An Email is required' };
      isError = true;
    } else if (!password.value) {
      error.value = { type: 'password', message: 'A Password is required' };
      isError = true;
    }
    return isError;
  });

  const login = $(async () => {
    const isError = await validate();
    if (isError) return;
    if (appStore.user) return;

    try {
      loading.value = true;

      await account.createEmailSession(email.value, password.value);

      try {
        const currentSession = await account.getSession('current');
        if (!currentSession) return;

        const response = await account.get();
        const profile = await getProfileByUserId(response?.$id);

        appStore.user = { ...profile };
      } catch (error) {
        appStore.user = undefined;
      }

      loading.value = false;
      appStore.isLoginOpen = false;
    } catch (error) {
      console.log(error);
      loading.value = false;
      alert(error);
    }
  });

  return (
    <>
      <div>
        <h1 class="text-center text-[28px] mb-4 font-bold">Log in</h1>

        <div class="px-6 pb-2">
          <TextInput
            string={email.value}
            placeholder="Email address"
            onUpdate$={(value) => {
              email.value = value;
            }}
            inputType="email"
            error={showError('email')}
          />
        </div>

        <div class="px-6 pb-2">
          <TextInput
            string={password.value}
            placeholder="Password"
            onUpdate$={(value) => {
              password.value = value;
            }}
            inputType="password"
            error={showError('password')}
          />
        </div>

        <div class="px-6 pb-2 mt-6">
          <button
            disabled={loading.value}
            onClick$={() => login()}
            class={[
              'flex items-center justify-center w-full text-[17px] font-semibold text-white py-3 rounded-sm',
              !email || !password ? 'bg-gray-200' : 'bg-[#F02C56]',
            ]}
          >
            {loading.value ? <Loader /> : 'Log in'}
          </button>
        </div>
      </div>
    </>
  );
});
